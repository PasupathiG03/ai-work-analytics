import { useState } from "react";
import API from "../api/api";

export default function AIChat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const askAI = async () => {
    const res = await API.post("/ai/query", {
        question: question,
    });

    setAnswer(res.data.answer);
  };

  return (
    <div>
      <h3>AI Assistant</h3>
      
      {/* Added a flex container here */}
      <div className="flex gap-2 mb-4">
        <input 
          className="flex-1 border p-2 rounded" 
          onChange={(e) => setQuestion(e.target.value)} 
          placeholder="Ask something..." 
        />
        <button 
          onClick={askAI} 
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Ask
        </button>
      </div>

      <p>{answer}</p>
    </div>
  );
}