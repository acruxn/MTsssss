from pydantic import BaseModel
from datetime import datetime
from typing import Any, Dict, List, Optional


# --- Form Template ---

class FieldDefinition(BaseModel):
    name: str
    label: str
    type: str  # text, number, date, select, phone, email
    required: bool = True
    options: Optional[List[str]] = None  # for select fields


class FormTemplateCreate(BaseModel):
    name: str
    fields: List[FieldDefinition]
    language: str = "en"
    category: str


class FormTemplateResponse(BaseModel):
    id: int
    name: str
    fields: List[FieldDefinition]
    language: str
    category: str
    created_at: datetime

    class Config:
        from_attributes = True


# --- Voice Session ---

class VoiceSessionCreate(BaseModel):
    user_id: int
    form_template_id: int
    language: str = "en"


class VoiceInput(BaseModel):
    session_id: int
    transcript: str
    language: str = "en"


class ExtractedFields(BaseModel):
    fields: Dict[str, Optional[Any]]
    confidence: float
    ai_source: str  # qwen, bedrock, both


class VoiceSessionResponse(BaseModel):
    id: int
    user_id: int
    form_template_id: int
    status: str
    filled_data: Optional[Dict] = None
    language: str
    created_at: datetime

    class Config:
        from_attributes = True
