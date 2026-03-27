from sqlalchemy.orm import Session
from app.models.session import Session as SessionModel
from datetime import timedelta

def get_user_sessions_context(db: Session, user_id: int):
    sessions = db.query(SessionModel).filter(
        SessionModel.user_id == user_id
    ).all()

    total_duration = timedelta()
    session_count = len(sessions)

    context = ""

    for s in sessions:
        if s.duration:
            total_duration += s.duration

    context += f"""
    Total Sessions: {session_count}
    Total Time Worked: {total_duration}
    """

    for s in sessions:
        context += f"""
        Start: {s.start_time}
        End: {s.end_time}
        Duration: {s.duration}
        """

    return context