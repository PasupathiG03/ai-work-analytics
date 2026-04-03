# AI-Powered Work Analytics System

A full-stack real-time productivity tracking system with AI-powered insights.

Live demo: https://ai-work-analytics.vercel.app
Backend API: https://ai-work-analytics.onrender.com/docs

---

## Why I built this

Most productivity tools just count hours. They don't tell you *what* you actually did or *how* to improve. I built this to combine real-time session tracking with a RAG-powered AI assistant that answers natural language questions about your own work history — giving you insights no spreadsheet can.

---

## How it works (Architecture)

```
User (Browser)
     |
     | HTTP + WebSocket
     v
React Frontend (Vercel)
     |
     | REST API calls
     v
FastAPI Backend (Render)
     |
     |---- PostgreSQL  →  stores sessions & user data
     |---- Redis       →  Pub/Sub for real-time WebSocket events
     |---- RAG Engine  →  retrieves session context for AI queries
     |
     v
OpenAI API  →  generates natural language insights
```

---

## Features

### Authentication
- JWT-based login and secure session handling

### Session tracking
- Start and end work sessions
- Prevents multiple active sessions
- Tracks duration automatically

### Real-time updates
- WebSocket-based live dashboard updates
- Redis Pub/Sub for scalable event broadcasting

### AI assistant (RAG)
- Ask natural language questions: "What did I do today?" or "How productive was I this week?"
- Uses your actual session data as context (not generic responses)
- Generates summaries and improvement suggestions

### Dashboard
- Session history view
- Live session timer
- Responsive UI

---

## Tech stack

Backend: FastAPI, PostgreSQL, Redis, WebSockets, JWT
Frontend: React, Tailwind CSS, Axios
AI: OpenAI API, RAG (Retrieval-Augmented Generation)
DevOps: Docker, Render (backend + DB), Vercel (frontend)

---

## Challenges I solved

**Real-time sync across tabs:** Multiple browser tabs needed to stay in sync. Solved using Redis Pub/Sub — the backend broadcasts session events to all connected WebSocket clients.

**RAG context window:** Feeding too much session history to the LLM caused slow responses. Solved by chunking and retrieving only the most relevant sessions per query.

**Session conflicts:** Users could accidentally start two sessions. Added a backend guard that checks for an active session before allowing a new one to start.

---

## Screenshots

### Dashboard
<img width="1918" height="1006" alt="Pasted image (3)" src="https://github.com/user-attachments/assets/8c08814d-44f4-4df4-b362-21028c38e33a" />

### Live session timer
<img width="1918" height="1006" alt="image" src="https://github.com/user-attachments/assets/36ee9a21-0a9b-4419-9a87-55a449c53085" />

### 🤖 AI Assistant
<img width="1918" height="1006" alt="Pasted image (5)" src="https://github.com/user-attachments/assets/5fef80b0-8e54-4668-81ab-5407240edfe4" />


---

## Local setup

### Clone
```bash
git clone https://github.com/PasupathiG03/ai-work-analytics.git
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Environment variables

Backend `.env`:
```
DATABASE_URL=your_db_url
SECRET_KEY=your_secret
OPENAI_API_KEY=your_key
```

Frontend `.env`:
```
REACT_APP_API_URL=http://localhost:8000
```

---

Built by Pasupathi G — open to backend / AI developer roles.
Connect on LinkedIn: https://www.linkedin.com/in/pasupathi-g/
