import { useState } from "react";
import API from "../services/api";
import Card from "../ui/components/Card";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
} from "chart.js";

import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

export default function StudentProgress() {

  const [roll, setRoll] = useState("");
  const [data, setData] = useState(null);
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");

  const semestersByYear = {
    "1": [1, 2],
    "2": [3, 4],
    "3": [5, 6],
    "4": [7, 8]
  };

  const semesterOptions = year
    ? semestersByYear[year] || []
    : [1, 2, 3, 4, 5, 6, 7, 8];

  const searchStudent = async () => {
    if (!roll) {
        alert("Please enter roll number");
        return;
      }

    try {

      const res = await API.get(`/student_analytics/${roll}?semester=${semester}`);
      console.log("Student Analytics Response:", res.data);
      setData(res.data);

    } catch (err) {
      console.error(err);
    }

  };

  return (

    <div className="space-y-6">

    {/* SEARCH */}
    <Card className="flex flex-col md:flex-row gap-4 items-center">

      <input
        className="border p-2 rounded w-full md:w-1/3"
        placeholder="Enter Roll Number"
        value={roll}
        onChange={(e)=>setRoll(e.target.value)}
      />

      <select
        className="border p-2 rounded w-full md:w-1/4"
        value={year}
        onChange={(e) => {
          const selectedYear = e.target.value;
          setYear(selectedYear);
          setSemester("");
        }}
      >
        <option value="">Select Year</option>
        {[1, 2, 3, 4].map((y) => (
          <option key={y} value={y}>Year {y}</option>
        ))}
      </select>

      <select
        className="border p-2 rounded w-full md:w-1/4"
        value={semester}
        onChange={(e)=>setSemester(e.target.value)}
      >
        <option value="">Select Semester</option>
        {semesterOptions.map(s => (
          <option key={s} value={s}>Sem {s}</option>
        ))}
      </select>

      <button
        onClick={searchStudent}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Search
      </button>

    </Card>

    {/* DATA */}
    {data && (
      <div className="space-y-6">

        {/* STUDENT INFO */}
        <Card>
          <h2 className="text-lg font-semibold mb-3">Student Information</h2>

          <p><b>Name:</b> {data.student_info.name}</p>
          <p><b>Roll Number:</b> {data.student_info.roll_number}</p>
          <p><b>Department:</b> {data.student_info.department}</p>
        </Card>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="p-6 rounded-2xl text-white shadow-md bg-gradient-to-r from-pink-500 to-red-400">
            <p className="text-sm opacity-80">Academic %</p>
            <h2 className="text-2xl font-bold">{data.academic_percentage}</h2>
          </div>

          <div className="p-6 rounded-2xl text-white shadow-md bg-gradient-to-r from-indigo-500 to-blue-500">
            <p className="text-sm opacity-80">Attendance %</p>
            <h2 className="text-2xl font-bold">{data.attendance_percentage}</h2>
          </div>

          <div className="p-6 rounded-2xl text-white shadow-md bg-gradient-to-r from-purple-500 to-pink-500">
            <p className="text-sm opacity-80">CGPA</p>
            <h2 className="text-2xl font-bold">{data.cgpa}</h2>
          </div>

        </div>

        {/* RISK */}
        {data.risk_status === "AT RISK" && (
          <Card>
            <p className="text-red-600 font-bold">
              Warning: Student is academically at risk
            </p>
          </Card>
        )}

        {/* MARKS TABLE */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Marks</h3>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Subject</th>
                <th className="border p-2">Internal 1</th>
                <th className="border p-2">Internal 2</th>
                <th className="border p-2">Semester Marks</th>
              </tr>
            </thead>

            <tbody>
              {data.marks?.map((m) => (
                <tr key={m.subject_id}>
                  <td className="border p-2">{m.subject_id}</td>
                  <td className="border p-2">{m.internal_1}</td>
                  <td className="border p-2">{m.internal_2}</td>
                  <td className="border p-2">{m.semester_marks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
          
        {/* CHARTS (MAIN FIX 🔥) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <Card className="h-[350px]">
            <h3 className="text-lg font-semibold mb-4">CGPA Trend</h3>
            <div className="h-full">
              <Line
                data={{
                  labels: data.cgpa_trend?.map(c => `Sem ${c.semester}`),
                  datasets: [{
                    label: "CGPA",
                    data: data.cgpa_trend?.map(c => c.cgpa),
                    borderColor: "blue"
                  }]
                }}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </Card>

          <Card className="h-[350px]">
            <h3 className="text-lg font-semibold mb-4">Attendance Trend</h3>
            <div className="h-full">
              <Bar
                data={{
                  labels: ["Attendance"],
                  datasets: [{
                    label: "Attendance %",
                    data: [data.attendance_percentage],
                    backgroundColor: "green"
                  }]
                }}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </Card>

        </div>

        {/* MARKS COMPARISON */}
        <Card className="h-[400px]">
          <h3 className="text-lg font-semibold mb-4">Marks Comparison</h3>

          <div className="h-full">
            <Bar
              data={{
                labels: data.marks?.map(m=>m.subject_id),
                datasets: [
                  {
                    label: "Internal 1",
                    data: data.marks?.map(m=>m.internal_1),
                    backgroundColor: "#a78a58"
                  },
                  {
                    label: "Internal 2",
                    data: data.marks?.map(m=>m.internal_2),
                    backgroundColor: "#1e3a8a"
                  },
                  {
                    label: "Semester",
                    data: data.marks?.map(m=>m.semester_marks),
                    backgroundColor: "#831843"
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false, // 🔥 MUST
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100
                  }
                }
              }}
            />
          </div>
        </Card>

        {/* RECOMMENDATIONS */}
        {data.recommendations?.length > 0 && (
          <Card>
            <h3 className="font-semibold mb-2">Recommendations</h3>
            <ul className="list-disc ml-6">
              {data.recommendations.map((r,i)=>(
                <li key={i}>{r}</li>
              ))}
            </ul>
          </Card>
        )}

      </div>
    )}

  </div>
);

}
