import logging

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from core.database import get_db
from models.transaction import FormTemplate
from models.alert import VoiceSession

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/dashboard", tags=["Dashboard"])


@router.get("/stats")
async def get_stats(db: Session = Depends(get_db)):
    """Dashboard summary stats for FormBuddy."""
    total_forms = db.query(func.count(FormTemplate.id)).scalar() or 0
    total_sessions = db.query(func.count(VoiceSession.id)).scalar() or 0
    active = db.query(func.count(VoiceSession.id)).filter(VoiceSession.status == "active").scalar() or 0
    completed = db.query(func.count(VoiceSession.id)).filter(VoiceSession.status == "completed").scalar() or 0

    lang_stats = (
        db.query(VoiceSession.language, func.count(VoiceSession.id))
        .group_by(VoiceSession.language)
        .all()
    )

    return {
        "total_forms": total_forms,
        "total_sessions": total_sessions,
        "active_sessions": active,
        "completed_sessions": completed,
        "sessions_by_language": {lang: count for lang, count in lang_stats},
    }
