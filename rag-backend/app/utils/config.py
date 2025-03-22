import os
from dotenv import load_dotenv

load_dotenv()

# Use Railway's injected environment variables
DATABASE_URL = os.environ["DATABASE_URL"]
REDIS_URL = os.environ["REDIS_URL"]
