import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.database import engine, Base

# Import models so they register with Base.metadata
from models import transaction, user, alert  # noqa: F401

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    _auto_seed()
    logger.info("FormBuddy started")
    yield
    logger.info("FormBuddy shutting down")


def _auto_seed():
    """Seed demo data if database is empty (for Lambda/SQLite cold starts)."""
    import json
    from core.database import SessionLocal
    from models.transaction import FormTemplate
    from models.user import User
    from models.alert import VoiceSession

    db = SessionLocal()
    try:
        if db.query(FormTemplate).count() > 0:
            return  # Already seeded

        logger.info("Auto-seeding demo data...")
        users = [
            User(name="Ahmad Razak", phone="+60121234567", preferred_language="ms"),
            User(name="Siti Nurhaliza", phone="+60129876543", preferred_language="ms"),
            User(name="Raj Kumar", phone="+60131112222", preferred_language="ta"),
            User(name="Mei Ling Tan", phone="+60143334444", preferred_language="zh"),
            User(name="John Smith", phone="+60155556666", preferred_language="en"),
        ]
        for u in users:
            db.add(u)
        db.flush()

        templates_data = [
            ("Fund Transfer", "transfer", "en", [
                {"name": "recipient", "label": "Recipient Name", "type": "text", "required": True},
                {"name": "amount", "label": "Amount (RM)", "type": "number", "required": True},
                {"name": "reference", "label": "Reference", "type": "text", "required": False},
            ]),
            ("Pindahan Wang", "transfer", "ms", [
                {"name": "penerima", "label": "Nama Penerima", "type": "text", "required": True},
                {"name": "jumlah", "label": "Jumlah (RM)", "type": "number", "required": True},
                {"name": "rujukan", "label": "Rujukan", "type": "text", "required": False},
            ]),
            ("Bill Payment", "payment", "en", [
                {"name": "biller", "label": "Biller Name", "type": "text", "required": True},
                {"name": "account_no", "label": "Account Number", "type": "text", "required": True},
                {"name": "amount", "label": "Amount (RM)", "type": "number", "required": True},
            ]),
            ("Prepaid Reload", "reload", "en", [
                {"name": "phone_number", "label": "Phone Number", "type": "phone", "required": True},
                {"name": "amount", "label": "Amount (RM)", "type": "number", "required": True},
                {"name": "carrier", "label": "Carrier", "type": "select", "required": True, "options": ["Maxis", "Celcom", "Digi", "U Mobile"]},
            ]),
            ("Bank Account Opening", "banking", "en", [
                {"name": "full_name", "label": "Full Name", "type": "text", "required": True},
                {"name": "ic_number", "label": "IC Number", "type": "text", "required": True},
                {"name": "phone", "label": "Phone Number", "type": "phone", "required": True},
                {"name": "account_type", "label": "Account Type", "type": "select", "required": True, "options": ["savings", "current"]},
            ]),
            ("Pembukaan Akaun Bank", "banking", "ms", [
                {"name": "nama_penuh", "label": "Nama Penuh", "type": "text", "required": True},
                {"name": "no_ic", "label": "Nombor IC", "type": "text", "required": True},
                {"name": "telefon", "label": "Nombor Telefon", "type": "phone", "required": True},
                {"name": "jenis_akaun", "label": "Jenis Akaun", "type": "select", "required": True, "options": ["simpanan", "semasa"]},
            ]),
        ]
        forms = []
        for name, cat, lang, fields in templates_data:
            f = FormTemplate(name=name, category=cat, language=lang, fields=json.dumps(fields))
            db.add(f)
            forms.append(f)
        db.flush()

        sessions_data = [
            (users[0], forms[1], "ms", "completed", {"nama_penuh": "Ahmad bin Razak", "no_ic": "900101-14-5678", "telefon": "+60121234567"}),
            (users[4], forms[4], "en", "completed", {"full_name": "John Smith", "ic_number": "850515-10-1234", "phone": "+60155556666", "account_type": "savings"}),
            (users[1], forms[0], "en", "completed", {"recipient": "Ahmad", "amount": 100, "reference": "rent"}),
            (users[0], forms[0], "en", "active", {"recipient": "Siti"}),
        ]
        for u, f, lang, status, data in sessions_data:
            db.add(VoiceSession(user_id=u.id, form_template_id=f.id, language=lang, status=status, filled_data=json.dumps(data)))

        db.commit()
        logger.info("Auto-seeded: %d users, %d templates, %d sessions", len(users), len(forms), len(sessions_data))
    except Exception as e:
        logger.error("Auto-seed failed: %s", e)
        db.rollback()
    finally:
        db.close()


app = FastAPI(
    title="FormBuddy",
    description="Multilingual voice-powered form-filling assistant (Malay, English, Chinese, Tamil)",
    version="0.1.0",
    lifespan=lifespan,
    redirect_slashes=False,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
from api.routes import transactions, analysis, dashboard  # noqa: E402

app.include_router(transactions.router)  # /api/v1/forms
app.include_router(analysis.router)      # /api/v1/voice
app.include_router(dashboard.router)     # /api/v1/dashboard


@app.get("/health")
async def health():
    return {"status": "ok", "service": "formbuddy"}


# Lambda handler
try:
    from mangum import Mangum  # noqa: E402
    handler = Mangum(app)
except ImportError:
    handler = None
