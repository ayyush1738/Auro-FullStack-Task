import numpy as np
from sqlalchemy.orm import Session
from app.models.database import DocumentEmbedding
from app.services.embedding_service import generate_embedding

def retrieve_relevant_docs(db: Session, query: str, top_n: int = 3):
    query_embedding = np.array(generate_embedding(query))
    docs = db.query(DocumentEmbedding).all()

    if not docs:
        return []

    embeddings = np.array([doc.embedding for doc in docs])
    norms = np.linalg.norm(embeddings, axis=1)
    query_norm = np.linalg.norm(query_embedding)

    similarities = np.dot(embeddings, query_embedding) / (norms * query_norm)
    
    # Pair with docs and sort
    ranked = sorted(zip(docs, similarities), key=lambda x: x[1], reverse=True)

    return [
        {
            "content": doc.content,
            "metadata": doc.doc_metadata,
            "similarity": sim
        }
        for doc, sim in ranked[:top_n]
    ]
