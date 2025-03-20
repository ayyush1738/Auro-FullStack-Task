from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from uuid import uuid4
import json
import pdfplumber
from app.models.database import SessionLocal, DocumentEmbedding
from app.services.embedding_service import generate_embedding
from app.utils.file_processing import extract_text_from_pdf

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
async def ingest_document(
    content: str = Form(None),
    metadata: str = Form("{}"),
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    """Accepts either a text document or a PDF file, generates embeddings, and stores them."""
    try:
        if file:
            if file.content_type != "application/pdf":
                raise HTTPException(status_code=400, detail="Only PDF files are supported.")
            
            extracted_text = extract_text_from_pdf(file.file)
            if not extracted_text:
                raise HTTPException(status_code=400, detail="No extractable text found in the PDF.")
            
            content = extracted_text  # Use extracted text for embedding

        if not content:
            raise HTTPException(status_code=400, detail="Document content cannot be empty.")

        embedding = generate_embedding(content)
        document_id = str(uuid4())

        new_doc = DocumentEmbedding(
            id=document_id,
            embedding=json.dumps(embedding),
            metadata=json.dumps(json.loads(metadata)),
            content=content
        )

        db.add(new_doc)
        db.commit()
        return {"message": "Document ingested successfully", "id": document_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
