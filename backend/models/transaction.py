from sqlalchemy import Column, Integer, String, DateTime, Text
from core.database import Base
from datetime import datetime


class FormTemplate(Base):
    __tablename__ = "form_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    fields = Column(Text, nullable=False)  # JSON array of field definitions
    language = Column(String(10), default="en")  # en, ms, zh, ta
    category = Column(String(50), nullable=False, index=True)
    webhook_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
