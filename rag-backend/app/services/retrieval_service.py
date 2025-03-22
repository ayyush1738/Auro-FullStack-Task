import numpy as np
from sqlalchemy.orm import Session
from app.models.database import DocumentEmbedding
from app.services.embedding_service import generate_embedding

def cosine_similarity(vec1, vec2):
    """Computes cosine similarity between two vectors."""
    vec1, vec2 = np.array(vec1), np.array(vec2)
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

def retrieve_relevant_docs(db: Session, query: str, top_n: int = 3):
    """Retrieves the most relevant documents based on cosine similarity."""
    query_embedding = generate_embedding(query)
    docs = db.query(DocumentEmbedding).all()

    similarities = []
    for doc in docs:
        similarity = cosine_similarity(query_embedding, doc.embedding)
        similarities.append((doc, similarity))

    similarities.sort(key=lambda x: x[1], reverse=True)
    
    return [{"content": doc.content, "metadata": doc.doc_metadata, "similarity": sim} for doc, sim in similarities[:top_n]]
