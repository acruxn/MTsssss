from sqlalchemy import Column, Integer, String, Float, DateTime
from core.database import Base
from datetime import datetime


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), unique=True, index=True)
    preferred_language = Column(String(10), default="en")
    balance = Column(Float, default=1234.56, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
