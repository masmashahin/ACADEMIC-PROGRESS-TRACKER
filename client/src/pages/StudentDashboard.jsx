import { useState } from "react";

import StudentSelfProgress from "../components/StudentSelfProgress";
import StudyPlanner from "../components/StudyPlanner";
import ProgressTracker from "../components/ProgressTracker";

import DashboardLayout from "../ui/layout/DashboardLayout";

export default function StudentDashboard() {

  const [tab, setTab] = useState("progress");

  const handleLogout = () => {
    localStorage.clear();
    window.location.replace("/login");
  };

  return (
    <DashboardLayout
      tab={tab}
      setTab={setTab}
      role="student"
      handleLogout={handleLogout}
      tabLabel={
        tab === "progress"
          ? "Progress"
          : tab === "planner"
          ? "Study Planner"
          : "Progress Tracker"
      }
    >

      {/* CONTENT BASED ON SIDEBAR */}

      {tab === "progress" && <StudentSelfProgress />}
      {tab === "planner" && <StudyPlanner />}
      {tab === "tracker" && <ProgressTracker />}

    </DashboardLayout>
  );
}