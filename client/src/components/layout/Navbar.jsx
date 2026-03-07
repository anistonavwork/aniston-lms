import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-wide">
          ANISTON LMS
        </Link>

        {/* Right Side */}
        <div className="flex items-center space-x-6 text-sm font-medium">

          {!isAuthenticated && (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 bg-black text-white rounded-md hover:opacity-90 transition"
              >
                Register
              </Link>
            </>
          )}

          {isAuthenticated && (
            <>
              {/* User Role Links */}
              {user?.role === "admin" && (
                <Link to="/admin" className="hover:underline">
                  Admin Panel
                </Link>
              )}

              {user?.role === "user" && (
                <Link to="/dashboard" className="hover:underline">
                  Dashboard
                </Link>
              )}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 border rounded-md hover:bg-black hover:text-white transition"
              >
                Logout
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;