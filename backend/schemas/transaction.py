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


class DetectIntentResponse(BaseModel):
    action_type: str  # form_fill, fuel_payment, check_balance, scan_pay, pin_reload, pay_toll, pay_parking, buy_insurance, apply_loan, invest, buy_ticket, food_delivery, donate, unknown
    template_id: Optional[int] = None
    template_name: Optional[str] = None
    action_label: Optional[str] = None
    fields: Dict[str, Optional[Any]] = {}
    confidence: float = 0.0
    confirmation_message: Optional[str] = None
    detected_language: str = "en"


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


# --- User / Payment ---

class TransferRequest(BaseModel):
    recipient: str
    amount: float
    reference: str = ""


class PaymentRequest(BaseModel):
    type: str
    amount: float
    details: Dict[str, Any] = {}


class BalanceResponse(BaseModel):
    balance: float
    name: str


class TransactionResponse(BaseModel):
    id: int
    type: str
    amount: float
    recipient: Optional[str] = None
    reference: Optional[str] = None
    status: str
    created_at: datetime


class TransferResponse(BaseModel):
    success: bool
    balance: float
    transaction_id: Optional[int] = None
    warnings: List[str] = []
    message: str
