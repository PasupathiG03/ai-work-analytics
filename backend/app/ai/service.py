from google import genai
import os

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

def generate_ai_response(context: str, question: str):
    prompt = f"""
        You are an AI productivity assistant.

        Analyze the user's work sessions and provide:
        1. Total productivity summary
        2. Patterns (short sessions, long sessions, gaps)
        3. Suggestions for improvement

        Do NOT just list sessions.

        Context:
        {context}

        Question:
        {question}
        """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    return response.text