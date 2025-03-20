from sentence_transformers import SentenceTransformer
import json
from app.models.database import redis_client
import numpy as np


# Load embedding model (optimized for fast CPU inference)
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

import numpy as np

def generate_embedding(text: str):
    """Generates embeddings using a local Sentence Transformer model."""

    # Generate embedding
    embedding = model.encode(text)  # Generate embedding
    embedding = np.array(embedding, dtype=np.float32).tolist()  # ✅ Ensure proper float array
    return embedding  # Return proper float list


