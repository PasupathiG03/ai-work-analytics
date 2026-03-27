from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.ai import AIQuery


from app.core.deps import get_db, get_current_user
from app.services.ai_service import get_user_sessions_context
from app.ai.service import generate_ai_response

router = APIRouter(prefix="/ai", tags=["AI"])

@router.post("/query")
def ask_ai(data: AIQuery, user=Depends(get_current_user), db: Session = Depends(get_db)):
    context = get_user_sessions_context(db, user.id)
    answer = generate_ai_response(context, data.question)

    return {
        "question": data.question,
        "answer": answer
    }


