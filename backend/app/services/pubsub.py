import json
from app.core.redis import redis_client

CHANNEL = "session_updates"

def publish_event(event: dict):
    redis_client.publish(CHANNEL, json.dumps(event))