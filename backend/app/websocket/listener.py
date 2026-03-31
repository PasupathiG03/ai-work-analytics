import asyncio
import json
from app.core.redis import redis_client
from app.websocket.manager import manager

CHANNEL = "session_updates"

async def redis_listener():
    if redis_client is None:
        return
    try:
        pubsub = redis_client.pubsub()
        pubsub.subscribe(CHANNEL)

        while True:
            message = pubsub.get_message(ignore_subscribe_messages=True)

            if message:
                data = message["data"]
                await manager.broadcast(data)

            await asyncio.sleep(0.1)  # ✅ prevents blocking
    except Exception as e:
        print("Redis not available:", e)



