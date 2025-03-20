from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json
import numpy as np
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
        # Ensure the question is properly formatted
        if isinstance(question, str):
            question = question.strip()
        else:
            raise HTTPException(status_code=400, detail="Invalid question format.")

        # Generate the embedding for the question
        question_embedding = generate_embedding(question)
        
        # Retrieve all stored embeddings
        docs = db.query(DocumentEmbedding).all()

        # Find the most relevant document using cosine similarity
        best_match = None
        best_similarity = -1

        for doc in docs:
            stored_embedding = json.loads(doc.embedding) if isinstance(doc.embedding, str) else doc.embedding
            stored_embedding = np.array(stored_embedding, dtype=np.float32)  # Ensure correct type

            # Compute similarity
            similarity = np.dot(question_embedding, stored_embedding) / (
                np.linalg.norm(question_embedding) * np.linalg.norm(stored_embedding)
            )

            if similarity > best_similarity:
                best_match = doc
                best_similarity = similarity
        
        if best_match:
            return {"answer": f"Based on document: {best_match.content}"}
        else:
            return {"answer": "No relevant documents found."}

    except HTTPException:
        raise  # Preserve FastAPI exceptions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
