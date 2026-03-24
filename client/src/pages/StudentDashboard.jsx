import { useState } from "react";
import { useNavigate } from "react-router-dom";

import StudentSelfProgress from "../components/StudentSelfProgress";
import StudyPlanner from "../components/StudyPlanner";
import ProgressTracker from "../components/ProgressTracker";

import PageContainer from "../ui/layout/PageContainer";
import Card from "../ui/components/Card";

export default function StudentDashboard() {

  const [tab, setTab] = useState("progress");


  return (
    <PageContainer title="Student Dashboard">

    <div className="space-y-6">

      <h1 className="text-3xl font-bold mb-6">
      
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

            // force React to reload app state cleanly
            window.location.replace("/login");
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
        Logout
        </button>

      </div>

      {/* Tab Content */}

      {tab === "progress" && (
        <Card>
          <StudentSelfProgress />
        </Card>
      )}
      {tab === "planner" && (
        <Card>
          <StudyPlanner />
        </Card>
      )}
      {tab === "tracker" && (
        <Card>
          <ProgressTracker />
        </Card>
      )}

    </div>

    </PageContainer>

  );

}