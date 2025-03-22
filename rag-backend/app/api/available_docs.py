from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json
from app.models.database import SessionLocal, DocumentEmbedding

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/list")
async def list_documents(db: Session = Depends(get_db)):
    """
    Returns all documents with full content, metadata, and ID.
    """
    try:
        docs = db.query(DocumentEmbedding).all()
        result = []

        for doc in docs:
            metadata = doc.doc_metadata
            if isinstance(metadata, str):
                try:
                    metadata = json.loads(metadata)
                except json.JSONDecodeError:
                    metadata = {}
            elif metadata is None:
                metadata = {}

            result.append({
                "id": doc.id,
                "metadata": metadata,
                "content": doc.content
            })

        return {"documents": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
