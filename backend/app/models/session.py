from sqlalchemy import Column, Integer, DateTime, ForeignKey, String, Interval
from app.core.database import Base
from datetime import datetime, timezone


class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    duration = Column(Interval, nullable=True)
    status = Column(String, default="active")