import json
import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from models.transaction import FormTemplate
from models.alert import VoiceSession
from schemas.transaction import (
    VoiceSessionCreate, VoiceSessionResponse, VoiceInput,
    ExtractedFields, FieldDefinition,
)
from services.fraud_service import FormService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/voice", tags=["Voice"])
form_service = FormService()


@router.post("/sessions", response_model=VoiceSessionResponse)
async def start_session(payload: VoiceSessionCreate, db: Session = Depends(get_db)):
    """Start a new voice form-filling session."""
    form = db.query(FormTemplate).filter(FormTemplate.id == payload.form_template_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form template not found")

    session = VoiceSession(
        user_id=payload.user_id,
        form_template_id=payload.form_template_id,
        language=payload.language,
        status="active",
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return _session_response(session)


@router.post("/extract", response_model=ExtractedFields)
async def extract_from_voice(payload: VoiceInput, db: Session = Depends(get_db)):
    """Extract form fields from voice transcript and update session."""
    session = form_service.get_session(db, payload.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    form = db.query(FormTemplate).filter(FormTemplate.id == session.form_template_id).first()
    fields = [FieldDefinition(**f) for f in json.loads(form.fields)]

    try:
        result = await form_service.extract_fields(payload.transcript, fields, payload.language)
        form_service.update_filled_data(db, session, result["fields"])
        return result
    except Exception as e:
        logger.exception("Error extracting fields")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/sessions/{session_id}", response_model=VoiceSessionResponse)
async def get_session(session_id: int, db: Session = Depends(get_db)):
    """Get voice session status and filled data."""
    session = form_service.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return _session_response(session)


@router.post("/sessions/{session_id}/complete", response_model=VoiceSessionResponse)
async def complete_session(session_id: int, db: Session = Depends(get_db)):
    """Mark a voice session as completed."""
    session = form_service.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    session.status = "completed"
    db.commit()
    db.refresh(session)
    return _session_response(session)


def _session_response(session: VoiceSession) -> dict:
    return {
        "id": session.id,
        "user_id": session.user_id,
        "form_template_id": session.form_template_id,
        "status": session.status,
        "filled_data": json.loads(session.filled_data) if session.filled_data else None,
        "language": session.language,
        "created_at": session.created_at,
    }
