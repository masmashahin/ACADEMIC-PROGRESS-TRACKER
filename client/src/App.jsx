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


  const ProtectedRoute = ({ children, allowedRole }) => {
    const role = localStorage.getItem("role");
  
    if (!role) {
      return <Navigate to="/login" replace />;
    }
  
    if (role !== allowedRole) {
      return <Navigate to="/login" replace />;
    }
  
    return children;
  };
  function App() {
  return (
    <Router>

      <Routes>

        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
            </ProtectedRoute> 
          }
        />

        <Route
          path="/faculty-dashboard"
          element={
            <ProtectedRoute allowedRole="faculty">
            <FacultyDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRole="student">
            <StudentDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </Router>
  );
}

export default App;