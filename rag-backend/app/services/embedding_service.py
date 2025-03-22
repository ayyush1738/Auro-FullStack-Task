import json
import numpy as np
from app.utils.cache import get_cached_embedding, cache_embedding

_model = None

def get_model():
    """Lazily load the sentence-transformer model to avoid memory issues."""
    global _model
    if _model is None:
        print("[INFO] Loading SentenceTransformer model...")
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer("sentence-transformers/paraphrase-MiniLM-L3-v2")  # Lighter model
    return _model

def generate_embedding(text: str):
    """Generate and cache sentence embedding."""
    cached = get_cached_embedding(text)
    if cached:
        return cached

    model = get_model()
    embedding = model.encode(text)
    embedding = np.array(embedding, dtype=np.float32).tolist()
    cache_embedding(text, embedding)
    return embedding
