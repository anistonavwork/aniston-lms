import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    fetchAnalytics();
    fetchPendingUsers();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axiosInstance.get("/admin/analytics");
      setStats(res.data.totals);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load analytics");
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const res = await axiosInstance.get("/admin/pending");
      setPendingUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const approveUser = async (id) => {
    try {
      await axiosInstance.put(`/admin/approve/${id}`);
      toast.success("User approved");
      fetchPendingUsers();
    } catch (err) {
      toast.error("Approval failed");
    }
  };

  const rejectUser = async (id) => {
    try {
      await axiosInstance.delete(`/admin/users/${id}`);
      toast.success("User rejected");
      fetchPendingUsers();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Analytics Cards */}

      <div className="grid grid-cols-3 gap-6 mb-10">
        <Card title="Total Users" value={stats.users} />
        <Card title="Courses" value={stats.courses} />
        <Card title="Modules" value={stats.modules} />
        <Card title="Enrollments" value={stats.enrollments} />
        <Card title="Assessments Passed" value={stats.assessmentsPassed} />
        <Card title="Certificates Issued" value={stats.certificatesIssued} />
      </div>

      {/* Pending Approvals */}

      <h2 className="text-xl font-semibold mb-4">Pending User Approvals</h2>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Designation</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {pendingUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No pending approvals
                </td>
              </tr>
            )}

            {pendingUsers.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.designation_name || "-"}</td>

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => approveUser(user.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => rejectUser(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Card = ({ title, value }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 text-center">
      <h3 className="text-gray-500 text-sm">{title}</h3>

      <p className="text-2xl font-bold mt-2">{value || 0}</p>
    </div>
  );
};

export default AdminDashboard;
