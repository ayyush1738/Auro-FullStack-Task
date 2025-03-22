from sentence_transformers import SentenceTransformer
import json
from app.models.database import redis_client
import numpy as np
from app.utils.cache import get_cached_embedding, cache_embedding

model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

def generate_embedding(text: str):
    """Generates embeddings using a local Sentence Transformer model with Redis caching."""
    cached = get_cached_embedding(text)
    if cached:
        return cached

    embedding = model.encode(text)
    embedding = np.array(embedding, dtype=np.float32).tolist()
    cache_embedding(text, embedding)
    return embedding



