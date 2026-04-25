import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from core.database import get_db
from models.user import User
from models.payment import Transaction
from schemas.transaction import (
    BalanceResponse, TransactionResponse, TransferRequest,
    TransferResponse, PaymentRequest,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/user", tags=["User"])

# Mutable demo user — switchable via /switch endpoint
_active_user_id = 1


def _get_user(db: Session) -> User:
    user = db.query(User).filter(User.id == _active_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def _fraud_checks(amount: float, user: User, recipient: str, db: Session) -> List[str]:
    warnings: List[str] = []
    if amount > 500:
        warnings.append("Unusual: Large amount (>RM500)")
    if amount > user.balance * 0.8:
        warnings.append("This will use over 80% of your balance")
    if recipient:
        exists = db.query(Transaction).filter(
            Transaction.user_id == user.id,
            Transaction.recipient == recipient,
        ).first()
        if not exists:
            warnings.append("First-time recipient")
    return warnings


@router.get("/accounts")
async def list_accounts(db: Session = Depends(get_db)):
    """List all demo accounts for switcher."""
    users = db.query(User).all()
    return [
        {"id": u.id, "name": u.name, "phone": u.phone, "language": u.preferred_language, "balance": u.balance, "active": u.id == _active_user_id}
        for u in users
    ]


@router.post("/switch")
async def switch_account(user_id: int = Query(...), db: Session = Depends(get_db)):
    """Switch active demo account."""
    global _active_user_id
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    _active_user_id = user_id
    return {"id": user.id, "name": user.name, "balance": user.balance, "language": user.preferred_language}


@router.get("/balance", response_model=BalanceResponse)
async def get_balance(db: Session = Depends(get_db)):
    user = _get_user(db)
    return {"balance": user.balance, "name": user.name}


@router.get("/transactions", response_model=List[TransactionResponse])
async def get_transactions(limit: int = 20, db: Session = Depends(get_db)):
    txns = (
        db.query(Transaction)
        .filter(Transaction.user_id == _active_user_id)
        .order_by(Transaction.created_at.desc())
        .limit(limit)
        .all()
    )
    return txns


@router.post("/transfer", response_model=TransferResponse)
async def transfer(payload: TransferRequest, db: Session = Depends(get_db)):
    if payload.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    user = _get_user(db)
    if payload.amount > user.balance:
        raise HTTPException(status_code=400, detail="Insufficient funds")
    warnings = _fraud_checks(payload.amount, user, payload.recipient, db)
    user.balance -= payload.amount
    txn = Transaction(
        user_id=user.id, type="transfer", amount=-payload.amount,
        recipient=payload.recipient, reference=payload.reference,
    )
    db.add(txn)
    db.commit()
    db.refresh(txn)
    return {
        "success": True, "balance": user.balance, "transaction_id": txn.id,
        "warnings": warnings, "message": f"Transferred RM{payload.amount:.2f} to {payload.recipient}",
    }


@router.post("/pay", response_model=TransferResponse)
async def pay(payload: PaymentRequest, db: Session = Depends(get_db)):
    if payload.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    user = _get_user(db)
    if payload.amount > user.balance:
        raise HTTPException(status_code=400, detail="Insufficient funds")
    warnings = _fraud_checks(payload.amount, user, "", db)
    user.balance -= payload.amount
    txn = Transaction(
        user_id=user.id, type=payload.type, amount=-payload.amount,
        reference=str(payload.details) if payload.details else None,
    )
    db.add(txn)
    db.commit()
    db.refresh(txn)
    return {
        "success": True, "balance": user.balance, "transaction_id": txn.id,
        "warnings": warnings, "message": f"Payment of RM{payload.amount:.2f} ({payload.type}) successful",
    }


@router.post("/reset")
async def reset_demo(db: Session = Depends(get_db)):
    """Reset ALL demo users and clear all transactions."""
    users = db.query(User).all()
    for u in users:
        u.balance = 1234.56
    db.query(Transaction).delete()
    db.commit()
    return {"balance": 1234.56, "message": "All accounts reset to RM1,234.56"}
