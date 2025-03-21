from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json
import numpy as np
# import ollama
from app.models.database import SessionLocal, DocumentEmbedding
from app.services.embedding_service import generate_embedding
from app.utils.groq_chat import generate_answer_groq


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
async def query_rag(question: str, db: Session = Depends(get_db)):
    """Retrieves relevant document embeddings and generates answers using Llama 3."""
    try:
        if not question.strip():
            raise HTTPException(status_code=400, detail="Question cannot be empty.")

        # Generate question embedding
        question_embedding = generate_embedding(question)

        # Retrieve all stored documents
        docs = db.query(DocumentEmbedding).all()

        # Find the most relevant document using cosine similarity
        best_match = None
        best_similarity = -1

        for doc in docs:
            stored_embedding = json.loads(doc.embedding) if isinstance(doc.embedding, str) else doc.embedding
            stored_embedding = np.array(stored_embedding, dtype=np.float32)

            # Compute cosine similarity
            similarity = np.dot(question_embedding, stored_embedding) / (
                np.linalg.norm(question_embedding) * np.linalg.norm(stored_embedding)
            )

            if similarity > best_similarity:
                best_match = doc
                best_similarity = similarity

        if not best_match:
            return {"answer": "No relevant documents found."}

        # Use retrieved document for context-aware answer generation
        document_context = best_match.content

        # Generate an answer using Llama 3 (Ollama)

        # inside the query_rag endpoint:
        answer = generate_answer_groq(question, best_match.content)
        return {"answer": answer}



    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
