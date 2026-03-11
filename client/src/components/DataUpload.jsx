import { useState } from "react";
import API from "../services/api";

export default function DataUpload(){

  const [marksFile,setMarksFile] = useState(null);
  const [attendanceFile,setAttendanceFile] = useState(null);

  const uploadMarks = async ()=>{

    const formData = new FormData();
    formData.append("file",marksFile);

    try{

      await API.post("/marks/upload_csv",formData);

      alert("Marks Uploaded Successfully");

    }catch(err){
      console.error(err);
      alert(err.response?.data?.msg);
    }

  };

  const uploadAttendance = async ()=>{

    if(!attendanceFile){
      alert("Please select an attendance CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file",attendanceFile);

    try{

      await API.post("/attendance/upload_csv",formData);

      alert("Attendance Uploaded Successfully");

    }catch(err){
      console.error(err);
    }

  };

  return(

    <div className="space-y-10">

      {/* MARKS UPLOAD */}

      <div>

        <h3 className="text-xl font-bold mb-3">
        Upload Marks CSV
        </h3>

        <input
        type="file"
        onChange={(e)=>setMarksFile(e.target.files[0])}
        />

        <button
        className="bg-green-600 text-white px-4 py-2 ml-3 rounded"
        onClick={uploadMarks}
        >
        Upload Marks
        </button>

      </div>


      {/* ATTENDANCE UPLOAD */}

      <div>

        <h3 className="text-xl font-bold mb-3">
        Upload Attendance CSV
        </h3>

        <input
        type="file"
        onChange={(e)=>setAttendanceFile(e.target.files[0])}
        />

        <button
        className="bg-blue-600 text-white px-4 py-2 ml-3 rounded"
        onClick={uploadAttendance}
        >
        Upload Attendance
        </button>

      </div>

    </div>

  );

}