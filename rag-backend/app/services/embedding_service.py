from sentence_transformers import SentenceTransformer
import json
from app.models.database import redis_client
import numpy as np


# Load embedding model (optimized for fast CPU inference)
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

def generate_embedding(text: str):
    """Generates embeddings using a local Sentence Transformer model."""
    cached_embedding = redis_client.get(text)
    if cached_embedding:
        return json.loads(cached_embedding)

    # Generate embedding
    embedding = model.encode(text).tolist()
    embedding = [float(x) for x in embedding]  # ✅ Convert all values to float
    redis_client.set(text, json.dumps(embedding), ex=3600)

    return embedding
