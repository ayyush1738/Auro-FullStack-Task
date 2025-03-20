from sqlalchemy import create_engine, Column, Text, JSON, String, Float
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import redis
from sqlalchemy import Float


# Load env variables
DB_URL = os.getenv("DATABASE_URL", "postgresql://postgres:1738@localhost:5432/rag_db")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# PostgreSQL Database Setup
engine = create_engine(DB_URL)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

# Redis Cache Setup
redis_client = redis.Redis.from_url(REDIS_URL)

# Document Embedding Model (Now uses `pgvector`)
class DocumentEmbedding(Base):
    __tablename__ = "document_embeddings"

    id = Column(String, primary_key=True)
    embedding = Column(ARRAY(Float), nullable=False)  # ✅ Uses proper PostgreSQL array type
    doc_metadata = Column(JSON)
    content = Column(Text, nullable=False)

# Create tables
Base.metadata.create_all(bind=engine)
