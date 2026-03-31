import json

try:
    from app.core.redis import redis_client
    REDIS_AVAILABLE = True
except Exception:
    REDIS_AVAILABLE = False


CHANNEL = "session_updates"

def publish_event(event: dict):
    if not REDIS_AVAILABLE:
        print("⚠️ Redis not available, skipping publish")
        return

    try:
        redis_client.publish(CHANNEL, json.dumps(event))
    except Exception as e:
        print("⚠️ Redis publish failed:", e)