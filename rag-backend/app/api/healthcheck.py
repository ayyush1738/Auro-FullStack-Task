from fastapi import APIRouter
import psycopg2
import redis
from app.utils.config import DATABASE_URL, REDIS_URL

router = APIRouter()

def check_postgres():
    """Check if PostgreSQL is accessible."""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        conn.close()
        return True
    except Exception as e:
        return str(e)

def check_redis():
    """Check if Redis is accessible."""
    try:
        r = redis.from_url(REDIS_URL)
        r.ping()
        return True
    except Exception as e:
        return str(e)

@router.get("/")
async def health_check():
    """
    API health check endpoint.
    Returns:
    - API status
    - PostgreSQL status
    - Redis status
    """
    postgres_status = check_postgres()
    redis_status = check_redis()

    return {
        "api_status": "Running",
        "postgres_status": "Connected" if postgres_status is True else f"Error: {postgres_status}",
        "redis_status": "Connected" if redis_status is True else f"Error: {redis_status}",
    }
