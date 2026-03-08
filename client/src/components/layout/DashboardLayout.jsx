import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-lg font-bold">ANISTON LMS</h2>
        </div>

        <nav className="flex-1 p-6 space-y-3 text-sm">
        
          {user?.role === "user" && (
            <>
              <Link to="/dashboard" className="block hover:opacity-80">
                My Courses
              </Link>

              <Link
                to="/dashboard/assessments"
                className="block hover:opacity-80"
              >
                Assessments
              </Link>

              <Link
                to="/dashboard/certificates"
                className="block hover:opacity-80"
              >
                Certificates
              </Link>

              <Link to="/dashboard/profile" className="block hover:opacity-80">
                Profile
              </Link>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <Link to="/admin" className="block hover:opacity-80">
                Dashboard
              </Link>

              <Link to="/admin/users" className="block hover:opacity-80">
                Manage Users
              </Link>

              <Link to="/admin/add-course" className="block hover:opacity-80">
                Add Course
              </Link>

              <Link
                to="/admin/courses"
                className="block hover:opacity-80"
              >
                Manage Courses
              </Link>
            </>
          )}
        </nav>
        <div className="p-6 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full bg-white text-black py-2 rounded-md text-sm"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        {/* Top Header */}
        <div className="bg-white border-b px-8 py-4 flex justify-between items-center">
          <h1 className="font-semibold text-lg">
            {user?.role === "admin" ? "Admin Panel" : "Learning Dashboard"}
          </h1>

          <div className="text-sm text-gray-600">
            {user?.name} ({user?.role})
          </div>
        </div>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
