from fastapi import FastAPI
from app.api import auth
from app.core.database import Base, engine
from app.api import auth, session, ws1
from app.api import ai
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from app.websocket.listener import redis_listener


app = FastAPI()

origins = [
    "https://ai-work-analytics.vercel.app",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(session.router)
app.include_router(ws1.router)
app.include_router(ai.router)

@app.on_event("startup")
async def startup_event():
    try:
        import asyncio
        asyncio.create_task(redis_listener())
    except Exception as e:
        print("Redis startup skipped:", e)

@app.get("/")
def root():
    return {"message": "API Running Successfully !"}










