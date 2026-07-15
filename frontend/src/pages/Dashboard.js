import { useEffect, useState } from "react";
import API from "../api/api";
import AIChat from "../components/AIChat";

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState("00:00:00");
  const [startTime, setStartTime] = useState(null);

  const loadSessions = async () => {
    try {
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
    } catch (err) {
      console.error("Error loading sessions", err);
    }
  };

  // Load sessions on mount
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/";
      return;
    }
    loadSessions();
  }, []);

  // Update timer interval
  useEffect(() => {
    let interval;
    if (startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);

        const hrs = String(Math.floor(diff / 3600)).padStart(2, "0");
        const mins = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
        const secs = String(diff % 60).padStart(2, "0");

        setTimer(`${hrs}:${mins}:${secs}`);
      }, 1000);
    } else {
      setTimer("00:00:00");
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
    return new Date(time).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
      hour: "numeric",
      minute: "2-digit",
      day: "numeric",
      month: "short",
    });
  };

  // Calculate statistics
  const completedSessions = sessions.filter((s) => s.status === "completed");
  const totalHours = sessions.reduce((acc, s) => {
    if (s.start_time && s.end_time) {
      const hrs = (new Date(s.end_time) - new Date(s.start_time)) / (1000 * 60 * 60);
      return acc + hrs;
    }
    return acc;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 font-sans">
      {/* Top Header / Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📊</span>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Analytics Hub
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">AI Productivity Tracking</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-slate-850 hover:bg-red-950/30 border border-slate-800 hover:border-red-900/30 text-slate-300 hover:text-red-400 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Metric / Stat widgets */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Live Timer Widget */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[140px]">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Session</span>
              <div className="text-3xl font-mono font-bold mt-2 text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.2)]">
                {isActive ? timer : "00:00:00"}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-red-500 animate-pulse" : "bg-slate-600"}`}></span>
              <span className="text-xs font-semibold text-slate-400">
                {isActive ? "Tracking Active Session" : "No Session Active"}
              </span>
            </div>
          </div>

          {/* Metric 2: Completed Sessions */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col justify-between min-h-[140px]">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Completed Sessions</span>
              <div className="text-4xl font-bold mt-2 text-slate-100">{completedSessions.length}</div>
            </div>
            <div className="text-xs text-slate-400 mt-4">Total tracked history count</div>
          </div>

          {/* Metric 3: Total Hours */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col justify-between min-h-[140px]">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Time Tracked</span>
              <div className="text-4xl font-bold mt-2 text-slate-100">{totalHours.toFixed(1)} hrs</div>
            </div>
            <div className="text-xs text-slate-400 mt-4">Cumulative session duration</div>
          </div>
        </section>

        {/* Start / Stop Session Controls */}
        <section className="flex flex-wrap justify-center gap-4 py-2">
          <button
            onClick={startSession}
            disabled={isActive}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all duration-200 shadow-lg shadow-green-950/20 active:scale-95 disabled:pointer-events-none"
          >
            ▶ Start Work Session
          </button>
          <button
            onClick={endSession}
            disabled={!isActive}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all duration-200 shadow-lg shadow-red-950/20 active:scale-95 disabled:pointer-events-none"
          >
            ⏹ End Work Session
          </button>
        </section>

        {/* Dashboard Grid Details */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: AI Assistant (Span 7) */}
          <div className="lg:col-span-7">
            <AIChat />
          </div>

          {/* Right Column: Log Timeline (Span 5) */}
          <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800 p-6 rounded-3xl shadow-xl h-[500px] flex flex-col">
            <h2 className="text-lg font-bold mb-4 text-slate-100 border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>⏱️ Session History</span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-800 rounded-full text-slate-400">
                {sessions.length} total
              </span>
            </h2>

            <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-slate-800 pr-1">
              {sessions.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-slate-500">
                  No session history available yet.
                </div>
              ) : (
                sessions.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 bg-slate-950/40 border border-slate-850 hover:border-slate-755 rounded-2xl flex items-center justify-between gap-4 transition-all duration-200"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-slate-300">
                        {formatTime(s.start_time)}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {s.end_time ? `Ended: ${formatTime(s.end_time)}` : "Still running..."}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        s.status === "active"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20 animate-pulse"
                          : "bg-slate-800/80 text-slate-400 border border-slate-700/50"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}