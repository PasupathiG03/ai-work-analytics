import redis
import os

try:
    redis_client = redis.Redis(
        host=os.getenv("REDIS_HOST", "localhost"),
        port=6379,
        decode_responses=True
    )

    # test connection
    redis_client.ping()

except Exception as e:
    print("⚠️ Redis not available:", e)
    redis_client = None