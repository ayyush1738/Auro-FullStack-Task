from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json
from app.models.database import SessionLocal, DocumentEmbedding
from app.services.embedding_service import generate_embedding

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
async def query_rag(question: str, db: Session = Depends(get_db)):
    """Retrieves relevant document embeddings and generates answers."""
    try:
        question_embedding = generate_embedding(question)
        
        # Retrieve all stored embeddings
        docs = db.query(DocumentEmbedding).all()
        
        # Find most relevant document using cosine similarity
        best_match = None
        best_similarity = -1

        for doc in docs:
            stored_embedding = json.loads(doc.embedding)
            similarity = sum(a * b for a, b in zip(question_embedding, stored_embedding))

            if similarity > best_similarity:
                best_match = doc
                best_similarity = similarity
        
        if best_match:
            return {"answer": f"Based on document: {best_match.content}"}
        else:
            return {"answer": "No relevant documents found."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
