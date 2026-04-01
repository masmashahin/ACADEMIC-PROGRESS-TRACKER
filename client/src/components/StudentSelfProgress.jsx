import { useState, useEffect } from "react";
import API from "../services/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

export default function StudentProgress() {

  const roll = localStorage.getItem("roll_number");
  const [data, setData] = useState(null);
  const [semester, setSemester] = useState("");
  useEffect(() => {

    const fetchStudent = async () => {
  
      try {
  
        const res = await API.get(`/student_analytics/${roll}?semester=${semester}`);
        setData(res.data);
  
      } catch (err) {
        console.error(err);
      }
  
    };
  
    fetchStudent();
  
  }, [semester]);

  return (

    <div>
        <div className="mb-6">

        <label className="mr-3 font-bold">
        Select Semester
        </label>

        <select
        className="border p-2"
        value={semester}
        onChange={(e)=>setSemester(e.target.value)}
        >

        <option value="">All Semesters</option>
        <option value="1">Sem 1</option>
        <option value="2">Sem 2</option>
        <option value="3">Sem 3</option>
        <option value="4">Sem 4</option>
        <option value="5">Sem 5</option>
        <option value="6">Sem 6</option>
        <option value="7">Sem 7</option>
        <option value="8">Sem 8</option>

        </select>

        </div>

      {/* STUDENT DATA */}

      {data && (

        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow mb-6 border">

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-5 rounded-xl shadow">
                <p className="text-sm">Academic %</p>
                <h2 className="text-2xl font-bold">{data.academic_percentage}%</h2>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-5 rounded-xl shadow">
                <p className="text-sm">Attendance %</p>
                <h2 className="text-2xl font-bold">{data.attendance_percentage}%</h2>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-5 rounded-xl shadow">
                <p className="text-sm">CGPA</p>
                <h2 className="text-2xl font-bold">{data.cgpa}</h2>
              </div>

            </div>

          {/* RISK WARNING */}

          {data.risk_status === "AT RISK" && (

            <p className="text-red-600 font-bold">
              Warning: Student is academically at risk
            </p>

          )}

          {/* MARKS TABLE */}

          <div className="border-white rounded-xl shadow p-6">

            <h3 className="font-semi-bold mb-4 text-lg">
              Marks
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full table-fixed border-collapse">

              <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                <tr>
                  <th className="p-3 text-left">Subject</th>
                  <th className="p-3 text-left">Internal 1</th>
                  <th className="p-3 text-left">Internal 2</th>
                  <th className="p-3 text-left">Semester Marks</th>
                </tr>
              </thead>

              <tbody className="divide-y text-gray-700">

                {data.marks?.map((m,i) => (

                  <tr key={i}>

                    <td className="p-3 border-b">{m.subject_id}</td>
                    <td className="p-3 border-b">{m.internal_1}</td>
                    <td className="p-3 border-b">{m.internal_2}</td>
                    <td className="p-3 border-b">{m.semester_marks}</td>

                  </tr>

                ))}

              </tbody>

              </table>
            </div>

          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CGPA CHART */}

            <div className="bg-white rounded-xl shadow p-6">

              <h3 className="font-semi-bold mb-4 text-lg">
                CGPA Trend
              </h3>
              <div className="h-[300px]">
                <Line
                  data={{
                    labels: data.cgpa_trend?.map(c => `Sem ${c.semester}`),
                    datasets: [
                      {
                        label: "CGPA",
                        data: data.cgpa_trend?.map(c => Number(c.cgpa)),
                        borderColor: "#1d4ed8",
                        backgroundColor: "rgba(29,78,216,0.15)",
                        pointRadius: 4,
                        pointBackgroundColor: "#1d4ed8",
                        tension: 0.4 
                
                      } 
                    ]
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      tooltip: {
                        enabled: true
                      },
                      legend: {
                        display: true
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: false,
                        min: 0,
                        max: 10,
                        ticks: {
                          stepSize: 1
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* ATTENDANCE CHART */}

            <div className="bg-white rounded-xl shadow p-6">

              <h3 className="font-semi-bold mb-4 text-lg">
                Attendance Trend
              </h3>
              <div className="h-[300px]">
                <Bar
                  data={{
                    labels: data.attendance?.map(a => `Sem ${a.semester}`),
                    datasets: [
                    {
                    label: "Attendance %",
                    data: data.attendance?.map(a => a.attendance_percentage),
                    backgroundColor: "green"
                    }
                    ]
                  }}
                />
              </div>
            </div>

            {/* MARKS COMPARISON */}

            <div className="bg-white rounded-xl shadow p-6 w-full">

              <h3 className="text-lg font-semibold mb-4">
                Marks Comparison
              </h3>
              <div className="w-fullh-[350px]">
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
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100
                      }
                    }
                  }}
                />
              </div>

            </div>

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