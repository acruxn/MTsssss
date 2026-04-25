import json
import logging
from typing import List, Optional

from sqlalchemy.orm import Session

from models.transaction import FormTemplate
from models.alert import VoiceSession
from schemas.transaction import FieldDefinition
from services.ai_service import AIService

logger = logging.getLogger(__name__)
ai_service = AIService()


class FormService:
    """Form field extraction from voice transcripts using dual-AI."""

    async def extract_fields(
        self, transcript: str, fields: List[FieldDefinition], language: str
    ) -> dict:
        """Extract form field values from a voice transcript."""
        field_desc = "\n".join(
            f"- {f.name} ({f.type}, {'required' if f.required else 'optional'}): {f.label}"
            for f in fields
        )
        prompt = (
            f"Extract form field values from this voice transcript.\n"
            f"Language: {language}\n"
            f"Transcript: \"{transcript}\"\n\n"
            f"Fields to extract:\n{field_desc}\n\n"
            f"Return JSON with keys: fields (object mapping field name to extracted value or null), "
            f"confidence (0.0-1.0)."
        )
        result = await ai_service.dual_analyze(prompt)
        return {
            "fields": result.get("fields", {}),
            "confidence": result.get("confidence", 0.5),
            "ai_source": "both" if result.get("qwen") and result.get("bedrock") else "qwen" if result.get("qwen") else "bedrock",
        }

    def get_session(self, db: Session, session_id: int) -> Optional[VoiceSession]:
        return db.query(VoiceSession).filter(VoiceSession.id == session_id).first()

    def update_filled_data(
        self, db: Session, session: VoiceSession, new_fields: dict
    ) -> VoiceSession:
        """Merge newly extracted fields into session's filled_data."""
        existing = json.loads(session.filled_data) if session.filled_data else {}
        for k, v in new_fields.items():
            if v is not None:
                existing[k] = v
        session.filled_data = json.dumps(existing)
        db.commit()
        db.refresh(session)
        return session
