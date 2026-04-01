import { useState, useEffect } from "react";
import API from "../services/api";

export default function ProgressTracker() {

  const formatTime = (hours) => {
    if (!hours || hours <= 0) return "0 min";
  
    const totalMinutes = hours * 60;
  
    const hrs = Math.floor(totalMinutes / 60);
    const mins = Math.floor(totalMinutes % 60);
  
    if (hrs > 0 && mins > 0) return `${hrs} hr ${mins} min`;
    if (hrs > 0) return `${hrs} hr`;
    return `${mins} min`;
  };

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

      {/* Goals Summary */}

      <div className="grid grid-cols-3 gap-6">

        <div className="p-6 rounded-2xl text-white shadow bg-gradient-to-r from-pink-500 to-red-400">
          <p className="text-sm">Total Goals</p>
          <h3 className="text-3xl font-bold">{data.total_goals}</h3>
        </div>

        <div className="p-6 rounded-2xl text-white shadow bg-gradient-to-r from-blue-500 to-indigo-500">
          <p className="text-sm">Completed Goals</p>
          <h3 className="text-3xl font-bold">{data.completed_goals}</h3>
        </div>

        <div className="p-6 rounded-2xl text-white shadow bg-gradient-to-r from-purple-500 to-pink-500">
          <p className="text-sm">Remaining Goals</p>
          <h3 className="text-3xl font-bold">{data.remaining_goals}</h3>
        </div>

      </div>


      {/* Completion Rate */}

      <div className="bg-white rounded-2xl shadow p-6">

        <p className="text-gray-500 mb-2">
          Completion Rate
        </p>

        <h3 className="text-xl font-bold mb-3">
          {data.completion_rate}%
        </h3>

        <div className="w-full bg-gray-200 h-3 rounded">

          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded"
            style={{ width: `${data.completion_rate}%` }}
          ></div>

        </div>

      </div>
      
      <div className="border p-4 rounded shadow">

        <h3 className="font-bold mb-3">
          Daily Study Progress
        </h3>

        {!data.goal_progress || data.goal_progress.length === 0 ? (
          <p className="text-gray-500">No active goals</p>
        ) : (
          <div className="space-y-3">

            {data.goal_progress?.map((g, i) => (

              <div key={i} className="p-4 rounded-xl border bg-gray-50">

                <p className="font-semibold text-grey-800">
                  {g.subject} - {g.topic}
                </p>

                <p className="text-sm text-gray-600">
                  Target: {formatTime(g.daily_target)} | Studied: {formatTime(g.study_time )} | Break: {formatTime(g.break_time )} 
                </p>

                <p className={`text-sm mt-1 font-semibold ${
                  g.efficiency < 40
                    ? "text-red-500"
                    : g.efficiency < 70
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}>
                  Efficiency: {g.efficiency}%
                </p>

                <p className={`font-bold ${
                  g.status === "Behind"
                    ? "text-red-500"
                    : g.status === "Ahead"
                    ? "text-green-500"
                    : "text-yellow-500"
                }`}>
                  {g.status}
                </p>
                {g.completion_ratio > 1 && (
                  <p className="text-green-600 text-sm font-bold">
                    Overachieved 🚀 ({Math.round(g.completion_ratio * 100)}%)
                  </p>
                )}

              </div>

            ))}

          </div>
        )}

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
        className="bg-gradient-to-r from-green-700 to-emerald-600 h-3 rounded"
        style={{ width: `${data.efficiency_score}%` }}
        ></div>

        </div>

        </div>


      {/* Study Hours Summary */}

      

      {/* Recommendations */}

      <div className="bg-white rounded-2xl shadow p-6">

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