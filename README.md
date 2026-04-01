# 🚀 AI-Powered Work Analytics System

A full-stack real-time productivity tracking system with AI-powered insights.

🔗 Live Demo: https://ai-work-analytics.vercel.app
⚙️ Backend API: https://ai-work-analytics.onrender.com/docs  

---

## 📌 Overview

This project is a **real-time work tracking and analytics platform** that allows users to:

- Track work sessions
- View productivity history
- Get AI-powered insights based on their activity

The system combines **real-time architecture + AI (RAG)** to deliver meaningful productivity analysis.

---

## ✨ Features

### 🔐 Authentication
- JWT-based authentication
- Secure login & session handling

### ⏱️ Session Tracking
- Start / End work sessions
- Prevent multiple active sessions
- Track duration automatically

### 📡 Real-Time Updates
- WebSocket-based live updates
- Redis Pub/Sub for scalable event handling

### 📊 Dashboard
- Session history
- Live session timer
- Clean and responsive UI

### 🤖 AI Assistant (RAG)
- Ask questions like:
  - *"What did I do today?"*
  - *"How productive was I?"*
- Uses session data as context
- Generates smart summaries and suggestions

---

## 🧠 Tech Stack

### Backend
- FastAPI
- PostgreSQL
- Redis (Pub/Sub)
- WebSockets
- JWT Authentication

### Frontend
- React
- Tailwind CSS
- Axios

### AI
- OpenAI API
- Retrieval-Augmented Generation (RAG)

### DevOps
- Docker
- Render (Backend + DB)
- Vercel (Frontend)

## 📸 Screenshots

### 📊 Dashboard
<img width="1918" height="1006" alt="Pasted image (3)" src="https://github.com/user-attachments/assets/8c08814d-44f4-4df4-b362-21028c38e33a" />

### ⏱️ Live Session Timer
<img width="1918" height="1006" alt="image" src="https://github.com/user-attachments/assets/36ee9a21-0a9b-4419-9a87-55a449c53085" />

### 🤖 AI Assistant
<img width="1918" height="1006" alt="Pasted image (5)" src="https://github.com/user-attachments/assets/5fef80b0-8e54-4668-81ab-5407240edfe4" />

---

## ⚙️ Installation (Local Setup)

### Clone Repository
```bash
git clone https://github.com/PasupathiG03/ai-work-analytics.git
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Environment Variables
### Backend .env
```bash
DATABASE_URL=your_db_url
SECRET_KEY=your_secret
OPENAI_API_KEY=your_key
```

### Frontend .env
```bash
REACT_APP_API_URL=http://localhost:8000
```

