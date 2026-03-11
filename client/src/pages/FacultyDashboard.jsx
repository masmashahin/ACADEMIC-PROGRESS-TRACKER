import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import FacultyOverview from "../components/FacultyOverview";
import StudentProgress from "../components/StudentProgress";
import DataUpload from "../components/DataUpload";
import CreateStudent from "../components/CreateStudent";

export default function FacultyDashboard() {

  const [tab, setTab] = useState("overview");

  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    if (role !== "faculty") {
      navigate(
        role === "admin"
          ? "/admin-dashboard"
          : role === "student"
          ? "/student-dashboard"
          : "/login"
      );
    }
  }, [role]);

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Faculty Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>

      </div>

      {/* Tabs */}

      <div className="flex gap-4 mb-8">

        <button
          onClick={() => setTab("overview")}
          className={`px-4 py-2 rounded ${
            tab === "overview"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Overview
        </button>

        <button
          onClick={() => setTab("progress")}
          className={`px-4 py-2 rounded ${
            tab === "progress"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Student Progress
        </button>

        <button
          onClick={() => setTab("upload")}
          className={`px-4 py-2 rounded ${
            tab === "upload"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Data Upload
        </button>

        <button
          onClick={() => setTab("students")}
          className={`px-4 py-2 rounded ${
            tab === "students"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Create Student
        </button>

      </div>

      {/* Tab Content */}

      {tab === "overview" && <FacultyOverview />}
      {tab === "progress" && <StudentProgress />}
      {tab === "upload" && <DataUpload />}
      {tab === "students" && <CreateStudent />}

    </div>
  );
}