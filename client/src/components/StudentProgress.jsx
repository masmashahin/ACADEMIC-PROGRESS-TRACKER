import { useState } from "react";
import API from "../services/api";

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
  const [semester, setSemester] = useState("");
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

    <div>

      {/* SEARCH */}

      <div className="mb-6 flex gap-3">

        <input
          className="border p-2"
          placeholder="Enter Roll Number"
          onChange={(e)=>setRoll(e.target.value)}
        />

        <select
            className="border p-2"
            onChange={(e)=>setSemester(e.target.value)}
        >
            <option value="">Select Semester</option>
            <option value="1">Sem 1</option>
            <option value="2">Sem 2</option>
            <option value="3">Sem 3</option>
            <option value="4">Sem 4</option>
            <option value="5">Sem 5</option>
            <option value="6">Sem 6</option>
            <option value="7">Sem 7</option>
            <option value="8">Sem 8</option>
        </select>

        <button
          onClick={searchStudent}
          className="bg-blue-500 text-white px-4 py-2 ml-3"
        >
          Search
        </button>

      </div>

      {/* STUDENT DATA */}

      {data && (

        <div className="space-y-6">
            <div className="bg-white p-6 rounded shadow mb-6">

                <h2 className="text-xl font-bold mb-2">
                Student Information
                </h2>

                <p>
                <b>Name:</b> {data.student_info.name}
                </p>

                <p>
                <b>Roll Number:</b> {data.student_info.roll_number}
                </p>

                <p>
                <b>Department:</b> {data.student_info.department}
                </p>

            </div>

          <p><b>Academic %:</b> {data.academic_percentage}</p>
          <p><b>Attendance %:</b> {data.attendance_percentage}</p>
          <p><b>CGPA:</b> {data.cgpa}</p>

          {/* RISK WARNING */}

          {data.risk_status === "AT RISK" && (

            <p className="text-red-600 font-bold">
              Warning: Student is academically at risk
            </p>

          )}

          {/* MARKS TABLE */}

          <div>

            <h3 className="font-bold mb-2">
              Marks
            </h3>

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

          </div>

          {/* CGPA CHART */}

          <div>

            <h3 className="font-bold mb-2">
              CGPA Trend
            </h3>

            <Line
              data={{
                labels: data.cgpa_trend?.map(c => `Sem ${c.semester}`),
                datasets: [
                  {
                    label: "CGPA",
                    data: data.cgpa_trend?.map(c => c.cgpa),
                    borderColor: "blue"
                  }
                ]
              }}
            />

          </div>

          {/* ATTENDANCE CHART */}

          <div>

            <h3 className="font-bold mb-2">
              Attendance Trend
            </h3>

            <Bar
              data={{
                labels: ["Attendance"],
                datasets: [
                  {
                    label: "Attendance %",
                    data: [data.attendance_percentage],
                    backgroundColor: "green"
                  }
                ]
              }}
            />

          </div>

          {/* MARKS COMPARISON */}

          <div>

            <h3 className="font-bold mb-2">
              Marks Comparison
            </h3>

            <Bar
              data={{
                labels: data.marks?.map(m=>m.subject_id),
                datasets: [
                  {
                    label: "Internal 1",
                    data: data.marks?.map(m=>m.internal_1),
                    backgroundColor: "orange"
                  },
                  {
                    label: "Internal 2",
                    data: data.marks?.map(m=>m.internal_2),
                    backgroundColor: "blue"
                  },
                  {
                    label: "Semester",
                    data: data.marks?.map(m=>m.semester_marks),
                    backgroundColor: "purple"
                  }
                ]
              }}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100
                  }
                }
              }}
            />

          </div>

          {/* RECOMMENDATIONS */}

          {data.recommendations && data.recommendations.length > 0  && (

            <div>

              <h3 className="font-bold">
                Recommendations
              </h3>

              <ul className="list-disc ml-6">

                {data.recommendations.map((r,i)=>(
                  <li key={i}>{r}</li>
                ))}

              </ul>

            </div>

          )}

        </div>

      )}

    </div>

  );
}