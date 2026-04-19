import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoggingIn(true);

    try {
  

      const response = await API.post("/auth/login", {
        email: email,
        password: password
      }, {
        timeout: 60000
      });
      const { access_token, role, roll_number } = response.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("role", role);

      if (role === "student") {
        localStorage.setItem("roll_number", roll_number);
      }

      switch (role) {
        case "admin":
          navigate("/admin-dashboard", { replace: true });
          break;

        case "faculty":
          navigate("/faculty-dashboard", { replace: true });
          break;

        case "student":
          navigate("/student-dashboard", { replace: true });
          break;

        default:
          navigate("/login");
      }

    } catch (error) {
      console.error(error);
      if (error.code === "ECONNABORTED") {
        alert("Login timed out. Backend may be waking up. Please try again in a few seconds.");
      } else {
        alert(error.response?.data?.msg || "Login failed. Please check your credentials.");
      }
    } finally {
      setLoggingIn(false);
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200">

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-xl w-96"
      >

        <h2 className="text-3xl font-bold mb-6 text-center">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loggingIn}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loggingIn ? "Logging in..." : "Login"}
        </button>

      </form>

    </div>

  );
}
