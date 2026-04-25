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
    logger.info("FormBuddy started")
    yield
    logger.info("FormBuddy shutting down")


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
