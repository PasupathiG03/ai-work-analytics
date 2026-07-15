from sqlalchemy.orm import Session
from app.models.session import Session as SessionModel
from app.models.user import User
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

def get_admin_sessions_context(db: Session):
    users = db.query(User).filter(User.is_admin == False).all()
    
    context = "You are an AI productivity assistant for an administrator.\n"
    context += "Here is the productivity data for all employees:\n\n"
    
    for u in users:
        sessions = db.query(SessionModel).filter(SessionModel.user_id == u.id).all()
        
        total_duration = timedelta()
        session_count = len(sessions)
        is_active = False
        
        for s in sessions:
            if s.status == "active":
                is_active = True
            if s.duration:
                total_duration += s.duration
                
        context += f"Employee: {u.username} (Email: {u.email}, ID: {u.id})\n"
        context += f"  Status: {'Active' if is_active else 'Inactive'}\n"
        context += f"  Total Sessions: {session_count}\n"
        context += f"  Total Time Worked: {total_duration}\n"
        context += "  Sessions History:\n"
        
        for s in sessions:
            context += f"    - Start: {s.start_time}, End: {s.end_time}, Duration: {s.duration}, Status: {s.status}\n"
        context += "\n"
        
    return context