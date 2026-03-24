import { useState,  } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";
import FacultyOverview from "../components/FacultyOverview";
import StudentProgress from "../components/StudentProgress";
import DataUpload from "../components/DataUpload";
import CreateStudent from "../components/CreateStudent";

import DashboardLayout from "../ui/layout/DashboardLayout";

export default function FacultyDashboard() {

  const [tab, setTab] = useState("overview");
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    const savedTab = localStorage.getItem("facultyTab");
    if (savedTab) {
      setTab(savedTab);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("facultyTab", tab);
  }, [tab]);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await API.get("/faculty/overview");
        setOverview(res.data);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchOverview();
  }, []);

  const navigate = useNavigate();
  
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };
  const menu = [
    { key: "overview", label: "Overview" },
    { key: "progress", label: "Student Progress" },
    { key: "upload", label: "Data Upload" },
    { key: "students", label: "Create Student" },
  ];
  
  const currentTab = menu.find((item) => item.key === tab);


  return (
    <DashboardLayout tab={tab} setTab={setTab} handleLogout={handleLogout} tabLabel={currentTab?.label}>
    

      

      {/* Tabs */}

      
      {/* Tab Content */}

      <div key={tab} className="animate-fade-in">
        {tab === "overview" && (
          <div className="space-y-8 w-full">

            {!overview ? (
              <div className="space-y-6">

              {/* Cards Skeleton */}
              <div className="grid grid-cols-3 gap-6">
                <div className="h-24 bg-gray-200 animate-pulse rounded-2xl"></div>
                <div className="h-24 bg-gray-200 animate-pulse rounded-2xl"></div>
                <div className="h-24 bg-gray-200 animate-pulse rounded-2xl"></div>
              </div>
            
              {/* Table Skeleton */}
              <div className="bg-white rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="h-5 w-40 bg-gray-200 animate-pulse rounded"></div>
            
                <div className="space-y-3">
                  <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            
            </div>
            ) : (
              <>
                <FacultyOverview type="stats" overview={overview} />
                <FacultyOverview type="table" overview={overview} />
              </>
            )}

          </div>
      )}
        {tab === "progress" && <StudentProgress />}
        {tab === "upload" && <DataUpload />}
        {tab === "students" && <CreateStudent />}
      </div>

    
    </DashboardLayout>
  );  
}