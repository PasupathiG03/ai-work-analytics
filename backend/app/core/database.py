import time
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# 🔁 Retry logic
for i in range(10):
    try:
        engine = create_engine(DATABASE_URL)
        connection = engine.connect()
        connection.close()
        print("✅ Database connected")
        break
    except Exception as e:
        print(f"⏳ DB not ready, retrying... ({i+1}/10)")
        time.sleep(3)
else:
    raise Exception("❌ Could not connect to DB")

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()