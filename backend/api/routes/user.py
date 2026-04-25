import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException
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

DEMO_USER_ID = 1


def _get_demo_user(db: Session) -> User:
    user = db.query(User).filter(User.id == DEMO_USER_ID).first()
    if not user:
        raise HTTPException(status_code=404, detail="Demo user not found")
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


@router.get("/balance", response_model=BalanceResponse)
async def get_balance(db: Session = Depends(get_db)):
    """Get demo user balance."""
    user = _get_demo_user(db)
    return {"balance": user.balance, "name": user.name}


@router.get("/transactions", response_model=List[TransactionResponse])
async def get_transactions(limit: int = 20, db: Session = Depends(get_db)):
    """Get recent transactions for demo user."""
    txns = (
        db.query(Transaction)
        .filter(Transaction.user_id == DEMO_USER_ID)
        .order_by(Transaction.created_at.desc())
        .limit(limit)
        .all()
    )
    return txns


@router.post("/transfer", response_model=TransferResponse)
async def transfer(payload: TransferRequest, db: Session = Depends(get_db)):
    """Transfer money with fraud checks."""
    if payload.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    user = _get_demo_user(db)
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
    """Generic payment (fuel, reload, bill)."""
    if payload.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    user = _get_demo_user(db)
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
    """Reset demo user balance and clear transactions."""
    user = db.query(User).filter(User.id == DEMO_USER_ID).first()
    if not user:
        raise HTTPException(status_code=404, detail="Demo user not found")
    user.balance = 1234.56
    db.query(Transaction).filter(Transaction.user_id == DEMO_USER_ID).delete()
    db.commit()
    return {"balance": 1234.56, "message": "Demo reset complete"}
