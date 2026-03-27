from pydantic import BaseModel

class AIQuery(BaseModel):
    question: str