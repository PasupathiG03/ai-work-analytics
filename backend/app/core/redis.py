import redis
import os
from dotenv import load_dotenv

load_dotenv()

try:
    redis_url = os.getenv("REDIS_URL")
    if redis_url:
        redis_client = redis.Redis.from_url(redis_url, decode_responses=True)
    else:
        redis_client = redis.Redis(
            host=os.getenv("REDIS_HOST", "localhost"),
            port=int(os.getenv("REDIS_PORT", 6379)),
            password=os.getenv("REDIS_PASSWORD", None),
            decode_responses=True
        )

    # test connection
    redis_client.ping()

except Exception as e:
    print("⚠️ Redis not available:", e)
    redis_client = None