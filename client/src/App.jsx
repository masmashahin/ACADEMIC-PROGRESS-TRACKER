import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AdminDashboard from "./pages/AdminDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";

function App() {

  const role = localStorage.getItem("role");

  const ProtectedRoute = ({ element, allowedRole }) => {

    if (!role) {
      return <Navigate to="/login" />;
    }

    if (role !== allowedRole) {
      return <Navigate to="/login" />;
    }

    return element;
  };

  return (
    <Router>

      <Routes>

        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute
              element={<AdminDashboard />}
              allowedRole="admin"
            />
          }
        />

        <Route
          path="/faculty-dashboard"
          element={
            <ProtectedRoute
              element={<FacultyDashboard />}
              allowedRole="faculty"
            />
          }
        />

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute
              element={<StudentDashboard />}
              allowedRole="student"
            />
          }
        />

      </Routes>

    </Router>
  );
}

export default App;