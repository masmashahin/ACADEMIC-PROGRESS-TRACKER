import { useState, useEffect } from "react";
import API from "../services/api";

export default function StudyPlanner() {

  const [goals, setGoals] = useState([]);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [hours, setHours] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Medium");

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await API.get("/study_planner");
      setGoals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createGoal = async () => {

    if (!subject || !topic || !hours) {
      alert("Please fill all fields");
      return;
    }

    try {

      await API.post("/study_planner", {
        subject,
        topic,
        estimated_hours: hours,
        deadline,
        priority
      });

      setSubject("");
      setTopic("");
      setHours("");
      setDeadline("");

      fetchGoals();
      alert("Study goal created successfully");

    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (goal) => {
    try {

      await API.put(`/study_planner/${goal.id}`, {
        completed: !goal.completed
      });

      fetchGoals();

    } catch (err) {
      console.error(err);
    }
  };

  // Group goals by subject
  const groupedGoals = goals.reduce((acc, goal) => {
    if (!acc[goal.subject]) {
      acc[goal.subject] = [];
    }
    acc[goal.subject].push(goal);
    return acc;
  }, {});

  return (

    <div className="space-y-6">

      <h2 className="text-xl font-bold mb-4">
        Study Planner
      </h2>

      {/* Create Goal Form */}

      <div className="grid grid-cols-2 gap-4 mb-6">

        <input
          className="border p-2"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <input
          className="border p-2"
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <input
          className="border p-2"
          type="number"
          placeholder="Estimated Hours"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />

        <input
          className="border p-2"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <select
          className="border p-2"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

      </div>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={createGoal}
      >
        Create Goal
      </button>

      {/* Goals List */}

      <h3 className="text-lg font-bold mt-8 mb-4">
        My Study Goals
      </h3>

      {Object.keys(groupedGoals).length === 0 && (
        <p className="text-gray-500">No study goals created yet.</p>
      )}

      {Object.keys(groupedGoals).map((subject) => (

        <div key={subject} className="mb-6">

            <h4 className="text-md font-bold mb-2">

            {subject} — Progress: {

            groupedGoals[subject].filter(g => g.completed).length

            } / {

            groupedGoals[subject].length

            }  (

            {Math.round(
                (groupedGoals[subject].filter(g => g.completed).length /
                groupedGoals[subject].length) * 100
            )}%)
                

            </h4>

          <table className="w-full border text-sm">

            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Done</th>
                <th className="border p-2">Topic</th>
                <th className="border p-2">Estimated Hours</th>
                <th className="border p-2">Priority</th>
                <th className="border p-2">Deadline</th>
              </tr>
            </thead>

            <tbody>

              {groupedGoals[subject].map((goal) => (

                <tr key={goal.id}>

                  <td className="border p-2 text-center">
                    <input
                      type="checkbox"
                      checked={goal.completed}
                      onChange={() => toggleComplete(goal)}
                    />
                  </td>

                  <td className="border p-2">
                    {goal.topic}
                  </td>

                  <td className="border p-2">
                    {goal.estimated_hours}
                  </td>

                  <td className={`border p-2 ${
                    goal.priority === "High"
                      ? "text-red-600"
                      : goal.priority === "Medium"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}>
                    {goal.priority}
                  </td>

                  <td className="border p-2">
                    {goal.deadline}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      ))}

    </div>

  );
}