import { useEffect, useState } from "react";
import API from "../api/api";
import AIChat from "../components/AIChat";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState("00:00:00");
  const [startTime, setStartTime] = useState(null);

  // Admin States
  const [isAdminView, setIsAdminView] = useState(false);
  const [usersProductivity, setUsersProductivity] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserSessions, setSelectedUserSessions] = useState([]);
  const [loadingUserLogs, setLoadingUserLogs] = useState(false);

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

  const fetchCurrentUser = async () => {
    try {
      const res = await API.get("/auth/me");
      setCurrentUser(res.data);
    } catch (err) {
      console.error("Error fetching current user", err);
    }
  };

  const loadUsersProductivity = async () => {
    try {
      const res = await API.get("/admin/users-productivity");
      setUsersProductivity(res.data);
    } catch (err) {
      console.error("Error loading users productivity", err);
    }
  };

  const inspectUserSessions = async (user) => {
    setSelectedUser(user);
    setLoadingUserLogs(true);
    try {
      const res = await API.get(`/admin/user/${user.id}/sessions`);
      setSelectedUserSessions(res.data);
    } catch (err) {
      console.error("Error loading user logs", err);
    } finally {
      setLoadingUserLogs(false);
    }
  };

  // Load profile and sessions on mount
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/";
      return;
    }
    fetchCurrentUser();
    loadSessions();
  }, []);

  // Poll for other users' productivity metrics if in admin view
  useEffect(() => {
    if (currentUser?.is_admin && isAdminView) {
      loadUsersProductivity();
    }
  }, [currentUser, isAdminView]);

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

  // Calculate statistics for personal dashboard
  const completedSessions = sessions.filter((s) => s.status === "completed");
  const totalHours = sessions.reduce((acc, s) => {
    if (s.start_time && s.end_time) {
      const hrs = (new Date(s.end_time) - new Date(s.start_time)) / (1000 * 60 * 60);
      return acc + hrs;
    }
    return acc;
  }, 0);

  // Admin summary stats
  const activeUsersCount = usersProductivity.filter((u) => u.is_active).length;

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
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                {currentUser?.is_admin ? "Administrator Mode" : "AI Productivity Tracking"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* View Switcher for Admins */}
            {currentUser?.is_admin && (
              <div className="bg-slate-950/80 p-1 border border-slate-800 rounded-xl flex gap-1">
                <button
                  onClick={() => setIsAdminView(false)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                    !isAdminView ? "bg-indigo-650 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  My Workspace
                </button>
                <button
                  onClick={() => setIsAdminView(true)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                    isAdminView ? "bg-indigo-650 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Admin Control Panel
                </button>
              </div>
            )}

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
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isAdminView ? (
          /* ==================== WORKSPACE MODE (USER DASHBOARD) ==================== */
          <div className="space-y-8">
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Live Timer Card */}
              <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col justify-between min-h-[140px]">
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

              {/* Completed Sessions Card */}
              <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col justify-between min-h-[140px]">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Completed Sessions</span>
                  <div className="text-4xl font-bold mt-2 text-slate-100">{completedSessions.length}</div>
                </div>
                <div className="text-xs text-slate-400 mt-4">Total tracked history count</div>
              </div>

              {/* Total Hours Card */}
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

            {/* Logs Timeline + Chat */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7">
                <AIChat />
              </div>

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
          </div>
        ) : (
          /* ==================== ADMIN MODE (CONTROL PANEL) ==================== */
          <div className="space-y-8">
            {/* Admin Stats Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col justify-between min-h-[120px]">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Registered Users</span>
                  <div className="text-4xl font-bold mt-2 text-slate-100">{usersProductivity.length}</div>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col justify-between min-h-[120px]">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Users Currently Active</span>
                  <div className="text-4xl font-bold mt-2 text-green-400">{activeUsersCount}</div>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col justify-between min-h-[120px]">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Monitored Hours</span>
                  <div className="text-4xl font-bold mt-2 text-indigo-400">
                    {usersProductivity.reduce((acc, u) => acc + u.total_hours, 0).toFixed(1)} hrs
                  </div>
                </div>
              </div>
            </section>

            {/* Users Productivity Table */}
            <section className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center">
                <h2 className="font-bold text-lg text-slate-100">User Performance & Status Monitor</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      <th className="py-4 px-6">Username</th>
                      <th className="py-4 px-6">Email</th>
                      <th className="py-4 px-6 text-center">Sessions Logged</th>
                      <th className="py-4 px-6 text-center">Hours Tracked</th>
                      <th className="py-4 px-6 text-center">Status</th>
                      <th className="py-4 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-sm text-slate-350">
                    {usersProductivity.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-slate-500">
                          No registered users found.
                        </td>
                      </tr>
                    ) : (
                      usersProductivity.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-800/10 transition-colors">
                          <td className="py-4 px-6 font-semibold text-slate-100">{user.username}</td>
                          <td className="py-4 px-6 text-slate-400">{user.email}</td>
                          <td className="py-4 px-6 text-center font-mono">{user.total_sessions}</td>
                          <td className="py-4 px-6 text-center font-mono text-indigo-400 font-semibold">{user.total_hours} hrs</td>
                          <td className="py-4 px-6 text-center">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                user.is_active
                                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                  : "bg-slate-800/80 text-slate-500 border border-slate-700/50"
                              }`}
                            >
                              {user.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => inspectUserSessions(user)}
                              className="bg-slate-800 hover:bg-indigo-650 border border-slate-700 hover:border-indigo-600 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95"
                            >
                              Inspect Logs
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Admin Session Log Inspector Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col h-[500px]">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-100">Sessions History Log</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Inspecting user: <span className="font-semibold text-indigo-400">{selectedUser.username}</span> ({selectedUser.email})
                </p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-slate-200 text-xl font-bold bg-slate-800 hover:bg-slate-750 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
              >
                &times;
              </button>
            </div>

            {/* Modal Body / Logs list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 scrollbar-thin scrollbar-thumb-slate-850">
              {loadingUserLogs ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                  <svg className="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Fetching logs from database...</span>
                </div>
              ) : selectedUserSessions.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-slate-500">
                  No sessions found for this user.
                </div>
              ) : (
                selectedUserSessions.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 bg-slate-950/50 border border-slate-850 hover:border-slate-800 rounded-2xl flex items-center justify-between gap-4 transition-all duration-200"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-slate-350">{formatTime(s.start_time)}</div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {s.end_time ? `Ended: ${formatTime(s.end_time)}` : "Still running..."}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {s.duration && (
                        <span className="text-xs font-mono text-indigo-400 font-semibold">
                          {s.duration}
                        </span>
                      )}
                      <span
                        className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          s.status === "active"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : "bg-slate-850 text-slate-500 border border-slate-800"
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/20 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold px-4 py-2 rounded-xl text-sm transition-all duration-200 active:scale-95"
              >
                Close Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}