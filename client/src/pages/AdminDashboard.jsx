import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import PageContainer from "../ui/layout/PageContainer";
import Card from "../ui/components/Card";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [faculty, setFaculty] = useState({
    name: "",
    email: "",
    department: "",
    password: ""
  });

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
    <PageContainer title="Admin Dashboard">

    <div className="p-10 space-y-10">

      <h1 className="text-3xl font-bold">
        
      </h1>
      <button
        onClick={()=>{
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            navigate("/", { replace: true });
        }}
        className="bg-red-500 text-white px-4 py-2 rounded"
        >
        Logout
        </button>


      {/* CREATE FACULTY */}

      <Card>

        <h2 className="text-xl font-semibold">
          Create Faculty
        </h2>

        <input
          className="border p-2 w-full"
          placeholder="Name"
          value={faculty.name}
          onChange={(e) =>
            setFaculty({ ...faculty, name: e.target.value })
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="Email"
          value={faculty.email}
          onChange={(e) =>
            setFaculty({ ...faculty, email: e.target.value })
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="Department"
          value={faculty.department}
          onChange={(e) =>
            setFaculty({ ...faculty, department: e.target.value })
          }
        />

        <input
          className="border p-2 w-full"
          type="password"
          placeholder="Password"
          value={faculty.password}
          onChange={(e) =>
            setFaculty({ ...faculty, password: e.target.value })
          }
        />

        <button
          onClick={handleCreateFaculty}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Faculty
        </button>

      </Card>


      {/* STUDENT CSV UPLOAD */}

        <Card>

        <h2 className="text-xl font-semibold">
          Upload Students CSV
        </h2>

        <input
          type="file"
          onChange={handleStudentUpload}
        />

      </Card>

    </div>
    </PageContainer>

  );

};

export default AdminDashboard;