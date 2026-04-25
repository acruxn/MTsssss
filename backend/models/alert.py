from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from core.database import Base
from datetime import datetime


class VoiceSession(Base):
    __tablename__ = "voice_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    form_template_id = Column(Integer, ForeignKey("form_templates.id"), nullable=False, index=True)
    status = Column(String(20), default="active")  # active, completed, cancelled
    filled_data = Column(Text)  # JSON of extracted field values
    language = Column(String(10), default="en")
    created_at = Column(DateTime, default=datetime.utcnow)
