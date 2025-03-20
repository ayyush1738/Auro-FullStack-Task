from sqlalchemy import create_engine, Column, Text, JSON, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import redis

# Load env variables
DB_URL = os.getenv("DATABASE_URL", "postgresql://postgres:1738@localhost:5432/rag_db")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# PostgreSQL Database Setup
engine = create_engine(DB_URL)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

# Redis Cache Setup
redis_client = redis.Redis.from_url(REDIS_URL)

# Document Embedding Model (Renamed metadata to doc_metadata)
class DocumentEmbedding(Base):
    __tablename__ = "document_embeddings"

    id = Column(String, primary_key=True)
    embedding = Column(Text, nullable=False)
    doc_metadata = Column(JSON)  # ✅ Renamed from metadata to doc_metadata
    content = Column(Text, nullable=False)

# Create tables
Base.metadata.create_all(bind=engine)
