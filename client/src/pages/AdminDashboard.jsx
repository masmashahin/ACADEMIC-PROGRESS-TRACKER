import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import DashboardLayout from "../ui/layout/DashboardLayout";
import Card from "../ui/components/Card";

const AdminDashboard = () => {
  
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [faculty, setFaculty] = useState({
    name: "",
    email: "",
    department: "",
    password: ""
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/", { replace: true });
  };

  const handleCreateFaculty = async () => {
    try {

      await API.post("/auth/register", {
        ...faculty,
        role: "faculty"
      });

      alert("Faculty created successfully");

      setFaculty({
        name: "",
        email: "",
        department: "",
        password: ""
      });

    } catch (err) {
      console.error(err);
      alert("Error creating faculty");
    }
  };


  const handleStudentUpload = async (e) => {

    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);

    try {

      await API.post("/students/upload_csv", formData);

      alert("Students uploaded successfully");

    } catch (err) {

      console.error(err);
      alert(err.response?.data?.msg ||"CSV upload failed");

    }

  };


  return (
    <DashboardLayout
      tab={tab}
      setTab={setTab}
      handleLogout={handleLogout}
      tabLabel="Admin Dashboard"
    >
  
      <div className="space-y-10">
  
        {/* CREATE FACULTY */}
        <div className="bg-white rounded-2xl shadow p-6">
  
          <h2 className="text-xl font-semibold mb-4">
            Create Faculty
          </h2>
  
          <input
            className="border p-2 w-full mb-3 rounded"
            placeholder="Name"
            value={faculty.name}
            onChange={(e) =>
              setFaculty({ ...faculty, name: e.target.value })
            }
          />
  
          <input
            className="border p-2 w-full mb-3 rounded"
            placeholder="Email"
            value={faculty.email}
            onChange={(e) =>
              setFaculty({ ...faculty, email: e.target.value })
            }
          />
  
          <input
            className="border p-2 w-full mb-3 rounded"
            placeholder="Department"
            value={faculty.department}
            onChange={(e) =>
              setFaculty({ ...faculty, department: e.target.value })
            }
          />
  
          <input
            className="border p-2 w-full mb-3 rounded"
            type="password"
            placeholder="Password"
            value={faculty.password}
            onChange={(e) =>
              setFaculty({ ...faculty, password: e.target.value })
            }
          />
  
          <button
            onClick={handleCreateFaculty}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 rounded-lg"
          >
            Create Faculty
          </button>
  
        </div>
  
        {/* CSV UPLOAD */}
        <div className="bg-white rounded-2xl shadow p-6">
  
          <h2 className="text-xl font-semibold mb-4">
            Upload Students CSV
          </h2>
  
          <input
            type="file"
            onChange={handleStudentUpload}
            className="border p-2 rounded w-full"
          />
  
        </div>
  
      </div>
  
    </DashboardLayout>
  );

};

export default AdminDashboard;