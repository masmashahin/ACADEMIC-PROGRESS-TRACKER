import { useState } from "react";
import API from "../services/api";

export default function CreateStudent(){

  const [file,setFile] = useState(null);

  const uploadStudents = async ()=>{

    const formData = new FormData();
    formData.append("file",file);
    try{

      await API.post("/students/upload_csv",formData);

      alert("Students uploaded");  

    }catch(err){
      console.error("UPLOAD ERROR:", err);
      console.log("SERVER RESPONSE:", err.response);
    
      if (err.response && err.response.data) {
        alert(JSON.stringify(err.response.data));
      } else {
        alert("Upload failed");
      }
    }

  };

  return(

    <div>

      <h3 className="font-bold mb-3">
      Upload Student CSV
      </h3>

      <input
      type="file"
      onChange={(e)=>setFile(e.target.files[0])}/>

      <button
      onClick={uploadStudents}
      className="bg-blue-500 text-white px-4 py-2 ml-3"
      >
      Upload
      </button>

    </div>

  );

}