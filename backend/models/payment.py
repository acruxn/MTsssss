from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from core.database import Base
from datetime import datetime


class Transaction(Base):
    __tablename__ = "payment_transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    type = Column(String(30), nullable=False)
    amount = Column(Float, nullable=False)
    recipient = Column(String(200))
    reference = Column(String(200))
    status = Column(String(20), default="completed")
    created_at = Column(DateTime, default=datetime.utcnow)
