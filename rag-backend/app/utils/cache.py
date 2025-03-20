import json
from app.models.database import redis_client

def get_cached_embedding(text: str):
    """Retrieve cached embedding if available."""
    cached_embedding = redis_client.get(text)
    return json.loads(cached_embedding) if cached_embedding else None

def cache_embedding(text: str, embedding: list):
    """Cache embedding to Redis."""
    redis_client.set(text, json.dumps(embedding), ex=3600)  # Expiry: 1 hour
