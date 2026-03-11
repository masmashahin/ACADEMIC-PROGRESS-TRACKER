import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import StudentSelfProgress from "../components/StudentSelfProgress";
import StudyPlanner from "../components/StudyPlanner";
import ProgressTracker from "../components/ProgressTracker";

export default function StudentDashboard() {

  const [tab, setTab] = useState("progress");

  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "student") {
      navigate(
        role === "admin"
          ? "/admin-dashboard"
          : role === "faculty"
          ? "/faculty-dashboard"
          : "/login"
      );
    }
  }, [role]);

  return (

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Student Dashboard
      </h1>

      {/* Tabs */}

      <div className="flex gap-6 mb-8">

        <button
          onClick={() => setTab("progress")}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Progress
        </button>

        <button
          onClick={() => setTab("planner")}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Study Planner
        </button>

        <button
          onClick={() => setTab("tracker")}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Progress Tracker
        </button>
        <button
          onClick={()=>{
            localStorage.clear();
            window.location.href="/";
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
        Logout
        </button>

      </div>

      {/* Tab Content */}

      {tab === "progress" && <StudentSelfProgress />}
      {tab === "planner" && <StudyPlanner />}
      {tab === "tracker" && <ProgressTracker />}

    </div>

  );

}