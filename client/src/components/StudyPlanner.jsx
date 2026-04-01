import React,{ useState, useEffect } from "react";
import API from "../services/api";

export default function StudyPlanner() {

  const [goals, setGoals] = useState([]);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [hours, setHours] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [timers, setTimers] = useState({});

  useEffect(() => {
    fetchGoals();
  }, []);
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("activeTimer"));
  
    if (!saved) return;
  
    const now = Date.now();
  
    let elapsed = 0;
  
    if (saved.running) {
      elapsed = (now - saved.start) / 1000;
    } else {
      elapsed = saved.elapsed || 0;
    }
  
    setTimers({
      [saved.goalId]: {
        start: saved.start,
        elapsed,
        breakTime: saved.breakTime || 0,
        running: saved.running,
        breakStart: saved.breakStart || null
      }
    });
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await API.get("/study_planner");
      setGoals(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  
  // ✅ TIMER LOOP (per goal)
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => {
        const updated = { ...prev };

        Object.keys(updated).forEach(id => {
          const t = updated[id];

          if (t.running) {
            updated[id].elapsed = (Date.now() - t.start) / 1000;
          }
        });

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

  const deleteGoal = async (id) => {
    try {
      await API.delete(`/study_planner/${id}`);
      fetchGoals();
    } catch (err) {
      console.error(err);
      alert("Error deleting goal");
    }
  };

  const toggleComplete = async (goal) => {
    try {

      await API.put(`/study_planner/${goal.id}`, {
        completed: !goal.completed
      });
      // ✅ close session if completed
      if (!goal.completed) {
        setSelectedGoalId(null);
      }
      fetchGoals();

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ TIMER FUNCTIONS

  const handleStart = (goalId) => {
    const now = Date.now();
  
    // ❗ ALWAYS RESET START
    setTimers(prev => ({
      ...prev,
      [goalId]: {
        start: now,
        elapsed: 0,
        breakTime: 0,
        running: true,
        breakStart: null
      }
    }));
  
    localStorage.setItem("activeTimer", JSON.stringify({
      goalId,
      start: now,
      running: true,
      breakTime: 0,
      breakStart: null
    }));
  };

  const handleBreak = (goalId) => {
    const now = Date.now();
    const current = timers[goalId];

    const elapsed = (now - current.start) / 1000;

    setTimers(prev => ({
      ...prev,
      [goalId]: {
        ...current,
        elapsed,
        running: false,
        breakStart: now
      }
    }));

    localStorage.setItem("activeTimer", JSON.stringify({
      ...current,
      goalId,
      elapsed,   // ✅ IMPORTANT
      breakStart: now,
      running: false
    }));
  };

  const handleResume = (goalId) => {
    const now = Date.now();
    const current = timers[goalId];
  
    const breakDuration = (now - current.breakStart) / 1000;
    const updatedBreakTime = (current.breakTime || 0) + breakDuration;
  
    setTimers(prev => ({
      ...prev,
      [goalId]: {
        ...current,
        running: true,
        breakTime: updatedBreakTime,
        breakStart: null
      }
    }));
  
    localStorage.setItem("activeTimer", JSON.stringify({
      ...current,
      goalId,
      breakTime: updatedBreakTime,
      breakStart: null,
      running: true
    }));
  };

  const handleEnd = async (goalId) => {
    const t = timers[goalId];

    if (!t) {
      alert("Start session first");
      return;
    }

    const end = Date.now();
    // 🔥 ADD THIS DEBUG (temporary)
    console.log("START:", t.start);
    console.log("END:", end);
    console.log("DIFF (sec):", (end - t.start) / 1000);

    // ❗ SAFETY CHECK (prevents huge wrong values)
    if ((end - t.start) > 1000 * 60 * 60 * 5) { // >5 hours
      alert("Session time looks incorrect. Please restart session.");
      return;
    }

    const breakHours = (t.breakTime || 0) / 3600;

    console.log("START RAW:", t.start);
    console.log("START DATE:", new Date(t.start));
    console.log("END DATE:", new Date(end));
    console.log("DIFF SEC:", (end - t.start) / 1000);

    try {
      const res = await API.post("/study_session", {
        goal_id: goalId,
        start_time: new Date(t.start * (t.start < 10000000000 ? 1000 : 1)).toISOString(),
        end_time: new Date(end).toISOString(),
        break_type: "manual",
        break_duration: breakHours
      });

      fetchGoals();


      // reset this goal timer
      setTimers(prev => {
        const updated = { ...prev };
        delete updated[goalId];
        return updated;
      });
      localStorage.removeItem("activeTimer");


    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.msg || "Error saving session");
    }
  };

  // group goals
  const groupedGoals = goals.reduce((acc, goal) => {
    if (!acc[goal.subject]) acc[goal.subject] = [];
    acc[goal.subject].push(goal);
    return acc;
  }, {});

  

  return (

    <div className="space-y-6">

      {/* Create Goal Form */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

        <input
          className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <input
          className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <input
          className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="number"
          placeholder="Estimated Hours"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />

        <input
          className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <select
          className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

      </div>

      <button
        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-lg shadow hover:scale-105 transition"
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

          <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
              <tr>
                <th className="border p-2">Done</th>
                <th className="border p-2">Topic</th>
                <th className="border p-2">Estimated Hours</th>
                <th className="border p-2">Priority</th>
                <th className="border p-2">Deadline</th>
              </tr>
            </thead>

            <tbody>

              {groupedGoals[subject].map((goal) => {

                const timer = timers[goal.id] || {};
                const elapsed = timer.elapsed || 0;
                const breakTime = timer.breakTime || 0;
                
                return (
                <React.Fragment key={goal.id}>
                  <tr
                    key={goal.id}
                    className={`cursor-pointer ${goal.completed ? "cursor-not-allowed bg-gray-100" : "hover:bg-gray-50"}`}
                    onClick={() => {
                      if (goal.completed) return;
                    
                      setSelectedGoalId(prev =>
                        prev === goal.id ? null : goal.id
                      );
                    }}
                  >
                    <td className="border p-2 text-center">
                    <input
                      type="checkbox"
                      checked={goal.completed}
                      onChange={() => toggleComplete(goal)}
                      disabled={goal.completed}
                    />
                    </td>

                    <td className={`border p-2 ${goal.completed ? "opacity-50" : ""}`}>
                      {goal.topic}
                    </td>

                    <td className={`border p-2 ${goal.completed ? "opacity-50" : ""}`}>
                      {goal.estimated_hours}
                    </td>

                    <td className="border p-2">
                      {goal.priority === "High" && (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">
                          High
                        </span>
                      )}
                      {goal.priority === "Medium" && (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-700">
                          Medium
                        </span>
                      )}
                      {goal.priority === "Low" && (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">
                          Low
                        </span>
                      )}
                    </td>

                    <td className="border p-2 flex justify-between items-center">
                      <span className={goal.completed ? "opacity-50" : ""}>
                        {new Date(goal.deadline).toLocaleDateString()}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteGoal(goal.id);
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </td>

                    
                  </tr>

                  {selectedGoalId === goal.id && (
                    <tr>
                      <td colSpan="5">
                        <div className="border p-4 rounded shadow bg-gray-50">

                          <h3 className="font-bold mb-3">
                            Study: {goal.topic}
                          </h3>

                          {/* ✅ FIXED DAILY TARGET */}
                          <p className="mb-2 text-sm text-gray-600">
                            Daily Target: {(() => {
                              const today = new Date();
                              const deadline = new Date(goal.deadline);

                              today.setHours(0,0,0,0);
                              deadline.setHours(0,0,0,0);

                              const days = Math.max(
                                1,
                                Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
                              );

                              return (goal.estimated_hours / days).toFixed(2);
                            })()} hrs/day
                          </p>

                          {/* ✅ PER-GOAL TIMER */}
                          {(() => {
                            const timer = timers[goal.id] || {};

                            return (
                              <p className="mb-2">
                                ⏱ Time: {Math.floor((elapsed - breakTime) / 60)} min {Math.floor((elapsed - breakTime) % 60)} sec
                              </p>
                            );
                          })()}

                          {/* ✅ FIXED BUTTONS */}
                          <div className="flex gap-3">
                          <button
                            onClick={() => handleStart(goal.id)}
                            disabled={goal.completed}
                            className="bg-blue-500 text-white px-3 py-2 rounded disabled:bg-gray-400"
                          >
                            Start
                          </button>

                          <button
                            onClick={() => handleBreak(goal.id)}
                            disabled={goal.completed}
                            className="bg-yellow-500 text-white px-3 py-2 rounded disabled:bg-gray-400"
                          >
                            Break
                          </button>

                          <button
                            onClick={() => handleResume(goal.id)}
                            disabled={goal.completed}
                            className="bg-green-500 text-white px-3 py-2 rounded disabled:bg-gray-400"
                          >
                            Resume
                          </button>

                          <button
                            onClick={() => handleEnd(goal.id)}
                            disabled={goal.completed}
                            className="bg-red-500 text-white px-3 py-2 rounded disabled:bg-gray-400"
                          >
                            End
                          </button>
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
                );
              })}
         
            </tbody>

          </table>

        </div>

      ))}
    </div>
  );
}