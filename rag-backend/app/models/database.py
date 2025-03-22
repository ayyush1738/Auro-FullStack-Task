from sqlalchemy import create_engine, Column, Text, JSON, String
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects import postgresql
from sqlalchemy_utils import ScalarListType
from sqlalchemy import text
import os
import redis

from pgvector.sqlalchemy import Vector

DB_URL = os.environ["DATABASE_URL"]
REDIS_URL = os.environ["REDIS_URL"]

engine = create_engine(DB_URL)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

# Create pgvector extension if not exists
with engine.connect() as conn:
    conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))

# Redis client
redis_client = redis.Redis.from_url(REDIS_URL)

class DocumentEmbedding(Base):
    __tablename__ = "document_embeddings"

    id = Column(String, primary_key=True)
    embedding = Column(Vector(384), nullable=False)  # Changed here
    doc_metadata = Column(JSONB)
    content = Column(Text, nullable=False)

Base.metadata.create_all(bind=engine)
