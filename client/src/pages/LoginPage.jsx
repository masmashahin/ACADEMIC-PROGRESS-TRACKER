import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
console.log(API);
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });
      console.log("LOGIN RESPONSE:", response.data);

      const token = response.data.access_token;
      const role = response.data.role;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      if (role === "student") {
        localStorage.setItem("roll_number", response.data.roll_number);
      }

      if (role === "admin") {
        window.location.href = "/admin-dashboard";
      }
      
      if (role === "faculty") {
        window.location.href = "/faculty-dashboard";
      }
      
      if (role === "student") {
        window.location.href = "/student-dashboard";
      }
    } catch (error) {
      console.error(error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Login</h1>
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
