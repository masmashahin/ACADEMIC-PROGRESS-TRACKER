export default function FacultyOverview({ type, overview }) {

  if (!overview) return null;

  if (type === "stats") {
    return (
      <div className="w-full">
        <div className="grid grid-cols-3 gap-6">

          <div className="p-6 rounded-2xl text-white shadow-lg bg-gradient-to-r from-pink-500 to-red-400">
            <p className="text-sm opacity-80">Total Students</p>
            <h2 className="text-4xl font-bold mt-2">
              {overview.total_students}
            </h2>
          </div>

          <div className="p-6 rounded-2xl text-white shadow-lg bg-gradient-to-r from-indigo-500 to-blue-500">
            <p className="text-sm opacity-80">Avg Academic %</p>
            <h2 className="text-4xl font-bold mt-2">
              {overview.average_academic_percentage?.toFixed(2)}%
            </h2>
          </div>

          <div className="p-6 rounded-2xl text-white shadow-lg bg-gradient-to-r from-purple-500 to-pink-500">
            <p className="text-sm opacity-80">Avg Attendance %</p>
            <h2 className="text-4xl font-bold mt-2">
              {overview.average_attendance_percentage?.toFixed(2)}%
            </h2>
          </div>

        </div>
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            At Risk Students
          </h2>
        </div>

        <table className="w-full text-sm">

          <thead className="text-gray-500 bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 font-medium">Roll No</th>
              <th className="text-left px-6 py-3 font-medium">Name</th>
              <th className="text-left px-6 py-3 font-medium">Academic %</th>
              <th className="text-left px-6 py-3 font-medium">Attendance %</th>
            </tr>
          </thead>

          <tbody>
            {overview?.at_risk_students?.map((s) => (
              <tr
                key={s.roll_number}
                className="border-t hover:bg-blue-50 transition-all duration-200 cursor-pointer"
              >
                <td className="px-6 py-4 font-medium text-gray-700">
                  {s.roll_number}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {s.name}
                </td>

                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-md bg-red-100 text-red-600 text-xs font-medium">
                    {s.academic_percentage}%
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-md bg-yellow-100 text-yellow-600 text-xs font-medium">
                    {s.attendance_percentage}%
                  </span>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>
    );
  }
}