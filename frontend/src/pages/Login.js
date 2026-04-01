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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-80">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

            <input className="w-full border p-2 mb-4 rounded" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
            <input className="w-full border p-2 mb-4 rounded" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>

            <button onClick={handleLogin} disabled={loading} className="w-full bg-blue-500 text-white py-2 rounded-lg mb-4">{loading ? "Logging in..." : "Login"}Login</button>
            <button onClick={() => (window.location.href = "/register")} className="w-full bg-blue-500 text-white py-2 rounded-lg">Go to Register</button>
        </div>
    </div>
    );
}



