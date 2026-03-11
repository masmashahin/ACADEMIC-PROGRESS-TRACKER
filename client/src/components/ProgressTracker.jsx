import { useState, useEffect } from "react";
import API from "../services/api";

export default function ProgressTracker() {

  const [data, setData] = useState(null);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {

    try {

      const res = await API.get("/progress_tracker");
      setData(res.data);

    } catch (err) {
      console.error("Error fetching progress:", err);
    }

  };

  if (!data) {
    return <p>Loading progress...</p>;
  }

  return (

    <div className="space-y-6">

      <h2 className="text-xl font-bold">
        Progress Tracker
      </h2>

      {/* Goals Summary */}

      <div className="grid grid-cols-3 gap-4">

        <div className="border p-4 rounded shadow">
          <p className="text-gray-500">Total Goals</p>
          <h3 className="text-2xl font-bold">
            {data.total_goals}
          </h3>
        </div>

        <div className="border p-4 rounded shadow">
          <p className="text-gray-500">Completed Goals</p>
          <h3 className="text-2xl font-bold text-green-600">
            {data.completed_goals}
          </h3>
        </div>

        <div className="border p-4 rounded shadow">
          <p className="text-gray-500">Remaining Goals</p>
          <h3 className="text-2xl font-bold text-red-500">
            {data.remaining_goals}
          </h3>
        </div>

      </div>


      {/* Completion Rate */}

      <div className="border p-4 rounded shadow">

        <p className="text-gray-500 mb-2">
          Completion Rate
        </p>

        <h3 className="text-xl font-bold mb-3">
          {data.completion_rate}%
        </h3>

        <div className="w-full bg-gray-200 h-3 rounded">

          <div
            className="bg-blue-500 h-3 rounded"
            style={{ width: `${data.completion_rate}%` }}
          ></div>

        </div>

      </div>

      {/* Study Efficiency Score */}

        <div className="border p-4 rounded shadow">

        <p className="text-gray-500 mb-2">
        Study Efficiency Score
        </p>

        <h3 className="text-xl font-bold mb-3">
        {data.efficiency_score}%
        </h3>

        <div className="w-full bg-gray-200 h-3 rounded">

        <div
        className="bg-green-500 h-3 rounded"
        style={{ width: `${data.efficiency_score}%` }}
        ></div>

        </div>

        </div>


      {/* Study Hours Summary */}

      <div className="grid grid-cols-3 gap-4">

        <div className="border p-4 rounded shadow">
          <p className="text-gray-500">Total Planned Hours</p>
          <h3 className="text-xl font-bold">
            {data.total_hours}
          </h3>
        </div>

        <div className="border p-4 rounded shadow">
          <p className="text-gray-500">Completed Hours</p>
          <h3 className="text-xl font-bold text-green-600">
            {data.completed_hours}
          </h3>
        </div>

        <div className="border p-4 rounded shadow">
          <p className="text-gray-500">Remaining Hours</p>
          <h3 className="text-xl font-bold text-red-500">
            {data.remaining_hours}
          </h3>
        </div>

      </div>


      {/* Recommendations */}

      <div className="border p-4 rounded shadow">

        <h3 className="font-bold mb-3">
          Effort-Based Recommendations
        </h3>

        {data.recommendations.length === 0 ? (

          <p className="text-gray-500">
            No recommendations available.
          </p>

        ) : (

          <ul className="list-disc ml-6">

            {data.recommendations.map((r, i) => (
              <li key={i}>
                {r}
              </li>
            ))}

          </ul>

        )}

      </div>

    </div>

  );
}