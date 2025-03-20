from sqlalchemy.orm import Session
from app.models.database import DocumentEmbedding
import json

def store_embedding(db: Session, doc_id: str, embedding: list, metadata: dict, content: str):
    """Stores the generated embedding in PostgreSQL."""
    new_doc = DocumentEmbedding(
        id=doc_id,
        embedding=json.dumps(embedding),
        metadata=json.dumps(metadata),
        content=content
    )
    db.add(new_doc)
    db.commit()
    return {"message": "Document stored successfully", "id": doc_id}

def get_all_embeddings(db: Session):
    """Retrieves all embeddings from PostgreSQL."""
    return db.query(DocumentEmbedding).all()
