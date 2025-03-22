from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import logging
import time
from dotenv import load_dotenv
from app.api import available_docs, document_routes, qna_routes, healthcheck
from fastapi.exceptions import RequestValidationError
from app.models.database import SessionLocal


load_dotenv()
# basic logging for better dev experience
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

app = FastAPI(title="RAG Backend", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://auro-full-stack-task.vercel.app"],  # Specify the frontend origin here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Track server uptime
start_time = time.time()

@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Middleware to log incoming requests and response times."""
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logging.info(f"{request.method} {request.url} - {response.status_code} [{process_time:.2f}s]")
    return response

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handles unexpected errors gracefully."""
    logging.error(f"Unexpected error: {exc}")
    return {"error": "An internal server error occurred", "details": str(exc)}

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handles request validation errors."""
    return {"error": "Invalid request", "details": exc.errors()}

@app.get("/")
def home():
    """Root endpoint for checking API status."""
    uptime = round(time.time() - start_time, 2)
    return {"message": "Welcome to the RAG API", "uptime_seconds": uptime}

# API Routes
app.include_router(document_routes.router, prefix="/document", tags=["Document Ingestion"])
app.include_router(qna_routes.router, prefix="/chat", tags=["Q&A"])
app.include_router(healthcheck.router, prefix="/healtheck", tags=["Health Check"])
app.include_router(available_docs.router, prefix="/documents", tags=["Docs Available"])

# Lifespan event for database cleanup
@app.on_event("shutdown")
def shutdown_db_connection():
    """Closes the database session on shutdown."""
    db = SessionLocal()
    db.close()