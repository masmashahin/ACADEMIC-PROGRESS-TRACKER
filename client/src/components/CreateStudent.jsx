import { useState } from "react";
import API from "../services/api";

export default function CreateStudent(){

  const [file,setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadStudents = async () => {

    if (!file) {
      alert("Please select a CSV file");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      setLoading(true);
  
      await API.post("/students/upload_csv", formData);
  
      alert("✅ Students uploaded successfully");
  
      setFile(null);
      setFileName("");
  
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
  
      if (err.response?.data) {
        alert(JSON.stringify(err.response.data));
      } else {
        alert("Upload failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
  
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Upload Student CSV
      </h3>
  
      <div className="flex items-center gap-4">
  
        {/* FILE INPUT */}
        <div className="flex-1">
  
          <input
            type="file"
            id="studentFile"
            className="hidden"
            onChange={(e) => {
              setFile(e.target.files[0]);
              setFileName(e.target.files[0]?.name);
            }}
          />
  
          <label
            htmlFor="studentFile"
            className="cursor-pointer block border border-gray-300 rounded-lg px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100"
          >
            {fileName || "Choose file"}
          </label>
  
        </div>
  
        {/* BUTTON */}
        <button
          onClick={uploadStudents}
          disabled={loading}
          className={`px-5 py-2 rounded-lg text-sm font-medium text-white transition
            ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}
          `}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
  
      </div>
  
    </div>
  
  );

}