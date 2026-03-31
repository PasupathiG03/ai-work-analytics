from sqlalchemy.orm import Session
from app.models.session import Session as SessionModel
from datetime import datetime
from app.services.pubsub import publish_event
from datetime import datetime, timezone



def start_session(db: Session, user_id: int):
    # 🔒 Check active session
    active = db.query(SessionModel).filter(SessionModel.user_id == user_id,SessionModel.status == "active").first()

    if active:
        return None  # Already running
    
    session = SessionModel(user_id=user_id)
    db.add(session)
    db.commit()
    db.refresh(session)
    
    publish_event({
        "type": "session_started",
        "user_id": user_id
    })

    return session


def end_session(db: Session, user_id: int):
    session = db.query(SessionModel).filter(SessionModel.user_id == user_id,SessionModel.status == "active").first()

    if not session:
        return None

    session.end_time = datetime.now(timezone.utc)
    session.duration = session.end_time - session.start_time
    session.status = "completed"
    db.commit()
    db.refresh(session)

    publish_event({
        "type": "session_ended",
        "user_id": user_id
    })

    return session

def get_sessions(db: Session, user_id: int):
    return db.query(SessionModel).filter(SessionModel.user_id == user_id).order_by(SessionModel.start_time.desc()).all()