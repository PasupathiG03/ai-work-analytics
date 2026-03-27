from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services.session_service import *

from app.core.deps import get_db, get_current_user
from app.services.session_service import start_session, end_session
from app.schemas.session import SessionOut

router = APIRouter(prefix="/session", tags=["Session"])

@router.post("/start", response_model=SessionOut)
def start(user=Depends(get_current_user), db: Session = Depends(get_db)):
    session = start_session(db, user.id)
    if not session:
        raise HTTPException(status_code=400, detail="Session already active")
    return session

@router.post("/end", response_model=SessionOut)
def end(user=Depends(get_current_user), db: Session = Depends(get_db)):
    session = end_session(db, user.id)
    if not session:
        raise HTTPException(status_code=400, detail="No active session")
    return session

@router.get("/history", response_model=list[SessionOut])
def history(user=Depends(get_current_user), db: Session = Depends(get_db)):
    return get_sessions(db, user.id)