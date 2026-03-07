import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import DashboardLayout from "./components/layout/DashboardLayout";
import CourseLearning from "./pages/dashboard/CourseLearning";
import ProtectedRoute from "./components/common/ProtectedRoute";

/* Public Pages */
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";

/* Admin Pages */
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import UserDetails from "./pages/admin/UserDetails";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageCourses from "./pages/admin/ManageCourses";
import ManageModules from "./pages/admin/ManageModules";

/* User Pages */
import UserDashboard from "./pages/dashboard/UserDashboard";
import Assessments from "./components/dashboard/Assessments";
import Certificates from "./components/dashboard/Certificates";
import UserProfile from "./components/dashboard/UserProfile";
import AdminAssessments from "./pages/admin/AdminAssessments";
import LmsStructure from "./pages/admin/LmsStructure";

function App() {
  const location = useLocation();

  const hideNavbar =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/dashboard");

  return (
    <div className="bg-white text-black">
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= USER DASHBOARD ================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserDashboard />} />

          <Route path="course/:id" element={<CourseLearning />} />

          <Route path="assessments" element={<Assessments />} />

          <Route path="certificates" element={<Certificates />} />

          <Route path="profile" element={<UserProfile />} />
        </Route>

        {/* ================= ADMIN DASHBOARD ================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />

          {/* USERS */}
          <Route path="users" element={<ManageUsers />} />
          <Route path="users/:id" element={<UserDetails />} />

          {/* LMS MANAGEMENT */}
          <Route path="categories" element={<ManageCategories />} />
          <Route path="courses" element={<ManageCourses />} />
          <Route path="modules" element={<ManageModules />} />
          <Route path="assessments" element={<AdminAssessments />} />
          <Route path="lms-structure" element={<LmsStructure />} />
        </Route>

        {/* ================= 404 ================= */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
