from sentence_transformers import SentenceTransformer
import json
from app.models.database import redis_client

# Load embedding model (optimized for fast CPU inference)
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

def generate_embedding(text: str):
    """Generates embeddings using a local Sentence Transformer model."""
    cached_embedding = redis_client.get(text)
    if cached_embedding:
        return json.loads(cached_embedding)

    # Generate embedding
    embedding = model.encode(text).tolist()

    # Cache the embedding in Redis
    redis_client.set(text, json.dumps(embedding), ex=3600)  # Cache for 1 hour
    return embedding
