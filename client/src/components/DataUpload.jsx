import { useState } from "react";
import API from "../services/api";

export default function DataUpload(){

  const [marksFile,setMarksFile] = useState(null);
  const [attendanceFile,setAttendanceFile] = useState(null);
  const [loadingMarks, setLoadingMarks] = useState(false);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  const [marksName, setMarksName] = useState("");
  const [attendanceName, setAttendanceName] = useState("");

  const uploadMarks = async ()=>{

    if(!marksFile){
      alert("Please select a marks CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file",marksFile);

    try{

      await API.post("/marks/upload_csv",formData);

      alert("Marks Uploaded Successfully");
      setMarksFile(null);
      setMarksName("");

    }catch (err) {
      alert(err.response?.data?.msg || "Upload failed");
    } finally {
      setLoadingMarks(false);
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

      setLoadingAttendance(true);
      await API.post("/attendance/upload_csv",formData);

      alert("Attendance Uploaded Successfully");
      setAttendanceFile(null);
      setAttendanceName("");

    }catch (err) {
      alert("Upload failed");
    } finally {
      setLoadingAttendance(false);
    }

  };

  return (

    <div className="space-y-8">
  
      {/* MARKS UPLOAD */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
  
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Upload Marks CSV
        </h3>
  
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="file"
              onChange={(e) => {
                setMarksFile(e.target.files[0]);
                setMarksName(e.target.files[0]?.name);
              }}
              className="hidden"
              id="marksFile"
            />
            <label
              htmlFor="marksFile"
              className="cursor-pointer block border border-gray-300 rounded-lg px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100"
            >
              {marksName || "Choose file"}
            </label>
          </div>
  
          <button
            disabled={loadingMarks}
            onClick={uploadMarks}
            className={`px-5 py-2 rounded-lg text-sm font-medium text-white transition
              ${loadingMarks ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}
            `}
          >
            {loadingMarks ? "Uploading..." : "Upload"}
          </button>
  
        </div>
  
      </div>
  
  
      {/* ATTENDANCE UPLOAD */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
  
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Upload Attendance CSV
        </h3>
  
        <div className="flex items-center gap-4">

          <div className="flex-1">
            <input
              type="file"
              onChange={(e) => {
                setAttendanceFile(e.target.files[0]);
                setAttendanceName(e.target.files[0]?.name);
              }}
              className="hidden"
              id="attendanceFile"
            />

            <label
              htmlFor="attendanceFile"
              className="cursor-pointer block border border-gray-300 rounded-lg px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100"
            >
              {attendanceName || "Choose file"}
            </label>
          </div>

          <button
            disabled={loadingAttendance}
            onClick={uploadAttendance}
            className={`px-5 py-2 rounded-lg text-sm font-medium text-white transition
              ${loadingAttendance ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}
            `}
          >
            {loadingAttendance ? "Uploading..." : "Upload"}
          </button>

        </div>
      </div>
  
    </div>
  
  );

}