import json
import logging
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from models.transaction import FormTemplate
from schemas.transaction import FormTemplateCreate, FormTemplateResponse, FieldDefinition

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/forms", tags=["Forms"])


@router.post("", response_model=FormTemplateResponse)
async def create_form(payload: FormTemplateCreate, db: Session = Depends(get_db)):
    """Create a new form template."""
    try:
        form = FormTemplate(
            name=payload.name,
            fields=json.dumps([f.model_dump() for f in payload.fields]),
            language=payload.language,
            category=payload.category,
        )
        db.add(form)
        db.commit()
        db.refresh(form)
        return _to_response(form)
    except Exception as e:
        logger.exception("Error creating form template")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("", response_model=List[FormTemplateResponse])
async def list_forms(
    category: Optional[str] = None,
    language: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """List form templates with optional filters."""
    q = db.query(FormTemplate)
    if category:
        q = q.filter(FormTemplate.category == category)
    if language:
        q = q.filter(FormTemplate.language == language)
    return [_to_response(f) for f in q.all()]


@router.get("/{form_id}", response_model=FormTemplateResponse)
async def get_form(form_id: int, db: Session = Depends(get_db)):
    """Get a form template by ID."""
    form = db.query(FormTemplate).filter(FormTemplate.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form template not found")
    return _to_response(form)


def _to_response(form: FormTemplate) -> dict:
    """Convert ORM model to response dict, parsing JSON fields."""
    return {
        "id": form.id,
        "name": form.name,
        "fields": json.loads(form.fields),
        "language": form.language,
        "category": form.category,
        "created_at": form.created_at,
    }
