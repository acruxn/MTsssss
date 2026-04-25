import json
import logging
from typing import Dict, List, Optional

from openai import OpenAI

from core.config import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = (
    "You are FormBuddy, a multilingual voice form-filling assistant. "
    "You extract structured form field values from voice transcripts. "
    "Supported languages: English, Malay, Chinese, Tamil. "
    "Respond in JSON with keys: fields (object), confidence (0.0-1.0)."
)


class AIService:
    """Dual-cloud AI abstraction — Qwen (Alibaba) + Bedrock (AWS)."""

    def __init__(self) -> None:
        self.qwen = OpenAI(
            api_key=settings.DASHSCOPE_API_KEY,
            base_url=settings.QWEN_BASE_URL,
        ) if settings.DASHSCOPE_API_KEY else None

        self._bedrock = None

    @property
    def bedrock(self):
        if self._bedrock is None:
            import boto3
            kwargs = {"region_name": settings.AWS_REGION}
            if settings.AWS_ACCESS_KEY_ID:
                kwargs["aws_access_key_id"] = settings.AWS_ACCESS_KEY_ID
                kwargs["aws_secret_access_key"] = settings.AWS_SECRET_ACCESS_KEY
                if settings.AWS_SESSION_TOKEN:
                    kwargs["aws_session_token"] = settings.AWS_SESSION_TOKEN
            self._bedrock = boto3.client("bedrock-runtime", **kwargs)
        return self._bedrock

    async def ask_qwen(self, prompt: str) -> Optional[str]:
        """Call Alibaba Cloud Qwen for field extraction."""
        if not self.qwen:
            logger.warning("Qwen not configured")
            return None
        try:
            response = self.qwen.chat.completions.create(
                model=settings.QWEN_MODEL,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.1,
                response_format={"type": "json_object"},
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Qwen error: {e}")
            return None

    async def ask_bedrock(self, prompt: str) -> Optional[str]:
        """Call AWS Bedrock Claude for field extraction (text response)."""
        if not self.bedrock:
            logger.warning("Bedrock not configured")
            return None
        try:
            response = self.bedrock.invoke_model(
                modelId=settings.BEDROCK_MODEL,
                body=json.dumps({
                    "anthropic_version": "bedrock-2023-05-31",
                    "max_tokens": 512,
                    "messages": [
                        {"role": "user", "content": f"{SYSTEM_PROMPT}\n\n{prompt}"}
                    ],
                }),
            )
            body = json.loads(response["body"].read())
            return body["content"][0]["text"]
        except Exception as e:
            logger.error(f"Bedrock error: {e}")
            return None

    async def _bedrock_tool_call(self, prompt: str, tool_name: str, tool_desc: str, schema: Dict) -> Optional[Dict]:
        """Call Bedrock Claude with tool_use for guaranteed structured JSON. Retries once on failure."""
        if not self.bedrock:
            logger.warning("Bedrock not configured")
            return None
        for attempt in range(2):
            try:
                response = self.bedrock.invoke_model(
                    modelId=settings.BEDROCK_MODEL,
                    body=json.dumps({
                        "anthropic_version": "bedrock-2023-05-31",
                        "max_tokens": 512,
                        "messages": [
                            {"role": "user", "content": prompt}
                        ],
                        "tools": [{
                            "name": tool_name,
                            "description": tool_desc,
                            "input_schema": schema,
                        }],
                        "tool_choice": {"type": "tool", "name": tool_name},
                    }),
                )
                body = json.loads(response["body"].read())
                for block in body.get("content", []):
                    if block.get("type") == "tool_use":
                        return block["input"]
                logger.error("Bedrock tool_use: no tool_use block in response")
            except Exception as e:
                logger.error(f"Bedrock tool_use error (attempt {attempt + 1}): {e}")
                if attempt == 0:
                    logger.info("Retrying Bedrock tool_use...")
        return None

    async def dual_analyze(self, prompt: str) -> dict:
        """Run both AIs and merge extracted fields."""
        qwen_raw = await self.ask_qwen(prompt)
        bedrock_raw = await self.ask_bedrock(prompt)

        qwen_result = _parse_json(qwen_raw) if qwen_raw else None
        bedrock_result = _parse_json(bedrock_raw) if bedrock_raw else None

        merged_fields: dict = {}
        confidence_scores: List[float] = []

        for result in [qwen_result, bedrock_result]:
            if not result:
                continue
            for k, v in result.get("fields", {}).items():
                if v is not None and k not in merged_fields:
                    merged_fields[k] = v
            if "confidence" in result:
                confidence_scores.append(float(result["confidence"]))

        return {
            "fields": merged_fields,
            "confidence": sum(confidence_scores) / len(confidence_scores) if confidence_scores else 0.5,
            "qwen": qwen_result,
            "bedrock": bedrock_result,
        }

    async def detect_intent(self, transcript: str, templates: list, language: str) -> Dict:
        """Detect user intent using Bedrock tool_use for guaranteed structured output."""
        template_desc = "\n".join(
            f"- Template '{t['name']}' (id={t['id']}, category={t['category']}): fields={[f['name'] for f in t['fields']]}"
            for t in templates
        )
        prompt = (
            f"You are FormBuddy, a TNG eWallet AI assistant. A user said: \"{transcript}\" (language: {language})\n\n"
            f"Available form templates:\n{template_desc}\n\n"
            f"Quick actions (no form needed):\n"
            f"- \"fuel_payment\": pay for fuel/petrol/minyak (params: fuel_type, amount, station)\n"
            f"- \"check_balance\": check eWallet balance/baki (no params)\n"
            f"- \"scan_pay\": scan and pay / QR payment at merchant/shop (params: merchant, amount)\n"
            f"- \"pin_reload\": reload prepaid phone/top up (params: phone, amount, carrier)\n\n"
            f"IMPORTANT: Always pick the best matching action_type. Use \"form_fill\" only when a template matches. "
            f"Use a quick action when the intent matches even loosely. Only use \"unknown\" if nothing fits at all.\n"
            f"Call the detect_intent tool with your analysis."
        )
        schema = {
            "type": "object",
            "properties": {
                "action_type": {
                    "type": "string",
                    "enum": ["form_fill", "fuel_payment", "check_balance", "scan_pay", "pin_reload", "unknown"],
                    "description": "The detected action type",
                },
                "template_id": {"type": "integer", "description": "Form template ID if action_type is form_fill"},
                "template_name": {"type": "string", "description": "Form template name if action_type is form_fill"},
                "action_label": {"type": "string", "description": "Human-readable action label e.g. Fuel Payment"},
                "fields": {"type": "object", "description": "Extracted parameter values"},
                "confidence": {"type": "number", "description": "Confidence score 0.0-1.0"},
                "confirmation_message": {"type": "string", "description": "Short confirmation message for the user"},
            },
            "required": ["action_type", "fields", "confidence", "confirmation_message"],
        }
        result = await self._bedrock_tool_call(
            prompt, "detect_intent",
            "Detect user intent from speech and extract parameters. Returns action type, fields, and confirmation message.",
            schema,
        )
        if not result:
            return {"action_type": "unknown", "template_id": None, "template_name": None,
                    "action_label": None, "fields": {}, "confidence": 0, "confirmation_message": None}
        return {
            "action_type": result.get("action_type", "unknown"),
            "template_id": result.get("template_id"),
            "template_name": result.get("template_name"),
            "action_label": result.get("action_label"),
            "fields": result.get("fields", {}),
            "confidence": float(result.get("confidence", 0)),
            "confirmation_message": result.get("confirmation_message"),
        }


def _parse_json(text: str) -> Optional[dict]:
    try:
        return json.loads(text)
    except (json.JSONDecodeError, TypeError):
        stripped = text.strip()
        if stripped.startswith("```"):
            lines = stripped.split("\n")
            lines = [l for l in lines if not l.strip().startswith("```")]
            try:
                return json.loads("\n".join(lines))
            except (json.JSONDecodeError, TypeError):
                pass
        return {"raw": text}
