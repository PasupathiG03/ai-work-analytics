from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List

from app.models.user import User
from app.models.session import Session as SessionModel
from app.core.deps import get_db, get_current_admin
from app.schemas.session import SessionOut
from pydantic import BaseModel

router = APIRouter(prefix="/admin", tags=["Admin"])

class UserProductivityOut(BaseModel):
    id: int
    username: str
    email: str
    total_sessions: int
    total_hours: float
    is_active: bool

@router.get("/users-productivity", response_model=List[UserProductivityOut])
def get_users_productivity(
    admin=Depends(get_current_admin), 
    db: Session = Depends(get_db)
):
    # Fetch all registered users (who are not administrators themselves)
    users = db.query(User).filter(User.is_admin == False).all()
    
    result = []
    for u in users:
        sessions = db.query(SessionModel).filter(SessionModel.user_id == u.id).all()
        
        # Calculate stats
        total_sessions = len(sessions)
        total_duration = timedelta()
        is_active = False
        
        for s in sessions:
            if s.status == "active":
                is_active = True
            if s.duration:
                total_duration += s.duration
                
        total_hours = total_duration.total_seconds() / 3600.0
        
        result.append(UserProductivityOut(
            id=u.id,
            username=u.username,
            email=u.email,
            total_sessions=total_sessions,
            total_hours=round(total_hours, 2),
            is_active=is_active
        ))
        
    return result

@router.get("/user/{user_id}/sessions", response_model=List[SessionOut])
def get_user_sessions(
    user_id: int, 
    admin=Depends(get_current_admin), 
    db: Session = Depends(get_db)
):
    # Fetch the history list of sessions for a specific user ID
    sessions = db.query(SessionModel).filter(SessionModel.user_id == user_id).order_by(SessionModel.start_time.desc()).all()
    return sessions
