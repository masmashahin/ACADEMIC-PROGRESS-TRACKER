import { useEffect, useState } from "react";
import API from "../services/api";

export default function FacultyOverview() {

  const [overview, setOverview] = useState(null);

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

  if (!overview) return <p>Loading...</p>;

  return (

    <div className="space-y-8">

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white p-6 shadow rounded">
          <h3>Total Students</h3>
          <p className="text-2xl font-bold">
            {overview.total_students}
          </p>
        </div>

        <div className="bg-white p-6 shadow rounded">
          <h3>Avg Academic %</h3>
          <p className="text-2xl font-bold">
            {overview.average_academic_percentage?.toFixed(2)}%
          </p>
        </div>

        <div className="bg-white p-6 shadow rounded">
          <h3>Avg Attendance %</h3>
          <p className="text-2xl font-bold">
            {overview.average_attendance_percentage?.toFixed(2)}%
          </p>
        </div>

      </div>

      <div>

        <h2 className="text-xl font-bold mb-3">
          At Risk Students
        </h2>

        <table className="w-full border">

          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Roll Number</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Academic %</th>
              <th className="border p-2">Attendance %</th>
            </tr>
          </thead>

          <tbody>

            {overview.at_risk_students?.map((s) => (

              <tr key={s.roll_number}>

                <td className="border p-2">
                  {s.roll_number}
                </td>

                <td className="border p-2">
                  {s.name}
                </td>

                <td className="border p-2">
                  {s.academic_percentage}%
                </td>

                <td className="border p-2">
                  {s.attendance_percentage}%
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );
}