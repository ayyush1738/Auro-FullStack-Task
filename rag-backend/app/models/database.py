from sqlalchemy import create_engine, Column, Text, JSON, String, Float
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import redis
from sqlalchemy import Float

DB_URL = os.environ["DATABASE_URL"]  # force it to crash if not provided
REDIS_URL = os.environ["REDIS_URL"]

engine = create_engine(DB_URL)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

redis_client = redis.Redis.from_url(REDIS_URL)

class DocumentEmbedding(Base):
    __tablename__ = "document_embeddings"

    id = Column(String, primary_key=True)
    embedding = Column(ARRAY(Float), nullable=False)  
    doc_metadata = Column(JSON)
    content = Column(Text, nullable=False)

Base.metadata.create_all(bind=engine)
