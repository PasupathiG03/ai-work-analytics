from pydantic import BaseModel
from datetime import datetime, timedelta

class SessionOut(BaseModel):
    id: int
    start_time: datetime
    end_time: datetime | None
    status: str
    duration: timedelta | None   

    class Config:
        from_attributes = True