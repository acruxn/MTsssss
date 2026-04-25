from sqlalchemy import Column, Integer, String, DateTime
from core.database import Base
from datetime import datetime


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), unique=True, index=True)
    preferred_language = Column(String(10), default="en")  # en, ms, zh, ta
    created_at = Column(DateTime, default=datetime.utcnow)
