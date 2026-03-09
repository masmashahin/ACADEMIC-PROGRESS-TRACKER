import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">

      <h1 className="text-5xl font-bold text-blue-600 mb-6">
        Academic Progress Tracker
      </h1>

      <p className="text-lg text-gray-600 mb-10 text-center max-w-xl">
        Monitor student academic performance, attendance and analytics.
      </p>

      <button
        onClick={() => navigate("/login")}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Login
      </button>

    </div>
  );
}