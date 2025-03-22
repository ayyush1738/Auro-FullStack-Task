from sqlalchemy.orm import Session
from app.models.database import DocumentEmbedding
from app.services.embedding_service import generate_embedding

def retrieve_relevant_docs(db: Session, query: str, top_n: int = 3):
    """Retrieves the most relevant documents using pgvector ANN search."""
    query_embedding = generate_embedding(query)
    
    results = db.query(DocumentEmbedding).order_by(
        DocumentEmbedding.embedding.l2_distance(query_embedding)
    ).limit(top_n).all()
    
    return [{
        "content": doc.content,
        "metadata": doc.doc_metadata,
        "similarity": None  # pgvector gives sorted results, you can ignore similarity
    } for doc in results]
