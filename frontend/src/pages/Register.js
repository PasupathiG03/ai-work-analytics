import { useState } from "react";
import API from "../api/api";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", {username,email,password,});
      alert("Registered successfully!");
      window.location.href = "/";
    }catch (err) {
    if (err.response?.data?.detail) {
      alert(err.response.data.detail);
    } else {
      alert("Registration failed");
    }
  } finally {
    setLoading(false);
  }
    
  };

 return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-80">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

            <input className="w-full border p-2 mb-4 rounded" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input className="w-full border p-2 mb-4 rounded" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
            <input className="w-full border p-2 mb-4 rounded" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>

            <button onClick={handleRegister} disabled={loading} className="w-full bg-blue-500 text-white py-2 rounded-lg mb-4">{loading ? "Registering in..." : "Register"}</button>
            <button onClick={() => (window.location.href = "/")} className="w-full bg-blue-500 text-white py-2 rounded-lg">Go to Login</button>
        </div>
    </div>
    );
}




