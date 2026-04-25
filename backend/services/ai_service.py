import json
import logging
from typing import Optional

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
            # On Lambda, credentials come from IAM role automatically
            # Locally, use explicit credentials from config
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
        """Call AWS Bedrock Claude for field extraction."""
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

    async def dual_analyze(self, prompt: str) -> dict:
        """Run both AIs and merge extracted fields."""
        qwen_raw = await self.ask_qwen(prompt)
        bedrock_raw = await self.ask_bedrock(prompt)

        qwen_result = _parse_json(qwen_raw) if qwen_raw else None
        bedrock_result = _parse_json(bedrock_raw) if bedrock_raw else None

        # Merge fields — prefer Qwen, fill gaps with Bedrock
        merged_fields: dict = {}
        confidence_scores: list[float] = []

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


def _parse_json(text: str) -> Optional[dict]:
    try:
        return json.loads(text)
    except (json.JSONDecodeError, TypeError):
        return {"raw": text}
