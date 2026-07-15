import { useState } from "react";
import API from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      window.location.href = "/dashboard";
    } catch (err) {
    alert(err.response?.data?.detail || "Login failed");
    }finally {
      setLoading(false);
    }
    
  };

  
return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 px-4">
      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-sm mt-2">Sign in to track your productivity session</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
              Email Address
            </label>
            <input 
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-slate-500 rounded-xl px-4 py-3 outline-none transition-all duration-200" 
              placeholder="name@example.com" 
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
              Password
            </label>
            <input 
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-slate-500 rounded-xl px-4 py-3 outline-none transition-all duration-200" 
              type="password" 
              placeholder="••••••••" 
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            onClick={handleLogin} 
            disabled={loading} 
            className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 mt-6 flex justify-center items-center"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Logging in...
              </span>
            ) : "Login"}
          </button>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-slate-800"></div>
            <span className="px-3 text-xs text-slate-500 uppercase tracking-wider">New to the system?</span>
            <div className="flex-1 border-t border-slate-800"></div>
          </div>

          <button 
            onClick={() => (window.location.href = "/register")} 
            className="w-full bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold py-3 rounded-xl transition-all duration-200 active:scale-[0.98]"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
}



