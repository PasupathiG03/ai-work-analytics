import { useEffect, useState } from "react";
import API from "../api/api";
import AIChat from "../components/AIChat";

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState("00:00:00");
  const [startTime, setStartTime] = useState(null);

  const loadSessions = async () => {
    const res = await API.get("/session/history");
    setSessions(res.data);

    const active = res.data.find((s) => s.status === "active");

    if (active) {
    setIsActive(true);
    setStartTime(new Date(active.start_time));
    } else {
    setIsActive(false);
    setStartTime(null);
    }
  };

  useEffect(() => {
  let interval;

  if (startTime) {
    interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now - startTime) / 1000);

      const hrs = String(Math.floor(diff / 3600)).padStart(2, "0");
      const mins = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
      const secs = String(diff % 60).padStart(2, "0");

      setTimer(`${hrs}:${mins}:${secs}`);
    }, 1000);
  }

  return () => clearInterval(interval);
}, [startTime]);

  const startSession = async () => {
      try {
          await API.post("/session/start");
          loadSessions();
      } catch (err) {
          alert(err.response?.data?.detail || "Error starting session");
      }
      };
  
    const endSession = async () => {
      try {
          await API.post("/session/end");
          loadSessions();
      } catch (err) {
          alert(err.response?.data?.detail || "Error ending session");
      }
      };

    const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
    };

    const formatTime = (time) => {
    return new Date(time).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard</h1>

      <div className="bg-black text-green-400 text-2xl font-mono p-4 rounded-xl mb-4 w-fit">
      {isActive ? timer : "00:00:00"}
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={startSession}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          Start Session
        </button>

        <button
          onClick={endSession}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          End Session
        </button>

        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-lg">Logout</button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">Session History</h2>

        {sessions.map((s) => (
          <div key={s.id} className="border-b py-2 text-sm">
            ⏱ {formatTime(s.start_time).toLocaleTimeString()} →{" "}
            {s.end_time ? formatTime(s.end_time).toLocaleTimeString() : "Running"}  
            ({s.status})
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <AIChat />
      </div>
    </div>
  );
}