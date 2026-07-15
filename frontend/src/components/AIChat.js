import { useState, useRef, useEffect } from "react";
import API from "../api/api";

export default function AIChat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hello! I am your AI productivity assistant. I can analyze your sessions and provide personalized feedback or answer questions about your work history. Ask me something like: 'Summarize my work sessions' or 'How can I improve my productivity?'",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const askAI = async (e) => {
    e?.preventDefault();
    if (!question.trim()) return;

    const userText = question;
    setQuestion(""); // Clear input immediately
    
    // Add user message to thread
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setLoading(true);

    try {
      const res = await API.post("/ai/query", { question: userText });
      setMessages((prev) => [...prev, { sender: "bot", text: res.data.answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Sorry, I encountered an error while communicating with my brain. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (suggestionText) => {
    setQuestion(suggestionText);
  };

  return (
    <div className="flex flex-col h-[500px] bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Bot Header */}
      <div className="bg-slate-900/80 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
              <span className="text-xl">🤖</span>
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">Productivity Bot</h3>
            <span className="text-xs text-green-400 font-medium">Online • Gemini Engine</span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2.5 max-w-[85%] ${
              msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            {msg.sender === "bot" && (
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm shadow">
                🤖
              </div>
            )}
            <div
              className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-gradient-to-br from-blue-650 to-indigo-650 text-white rounded-tr-none shadow-md shadow-indigo-900/10"
                  : "bg-slate-800/85 text-slate-200 border border-slate-750 rounded-tl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-2.5 max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm shadow animate-pulse">
              🤖
            </div>
            <div className="bg-slate-800/60 border border-slate-750 text-slate-400 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length === 1 && !loading && (
        <div className="px-6 py-2 flex flex-wrap gap-2">
          <button
            onClick={() => handleSuggestion("How productive was I this week?")}
            className="text-xs bg-slate-800/60 hover:bg-slate-800 border border-slate-750 hover:border-slate-700 text-slate-400 px-3 py-1.5 rounded-full transition-all duration-200"
          >
            📊 How productive was I this week?
          </button>
          <button
            onClick={() => handleSuggestion("Summarize my active session history")}
            className="text-xs bg-slate-800/60 hover:bg-slate-800 border border-slate-750 hover:border-slate-700 text-slate-400 px-3 py-1.5 rounded-full transition-all duration-200"
          >
            ⏱️ Summarize my session history
          </button>
        </div>
      )}

      {/* Chat Input */}
      <form onSubmit={askAI} className="p-4 border-t border-slate-800 bg-slate-900/60 flex gap-2 items-center">
        <input
          className="flex-1 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask AI about your sessions..."
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="bg-indigo-650 hover:bg-indigo-600 disabled:opacity-40 disabled:hover:bg-indigo-650 text-white p-3 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg shadow-indigo-900/20 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9-2-9-18-9 18 9 2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
}