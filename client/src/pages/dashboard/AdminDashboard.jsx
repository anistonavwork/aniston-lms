import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import AnalyticsChart from "../../components/common/AnalyticsChart";

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  /* =========================
     FETCH ANALYTICS
  ========================= */
  const fetchAnalytics = async () => {
    try {
      const res = await axiosInstance.get("/admin/analytics");
      setAnalytics(res.data);
    } catch (error) {
      toast.error("Failed to load analytics");
    }
  };

  /* =========================
     FETCH PENDING USERS
  ========================= */
  const fetchPending = async () => {
    try {
      const response = await axiosInstance.get("/admin/pending");
      setPendingUsers(response.data);
    } catch (error) {
      toast.error("Failed to load pending users");
    }
  };

  /* =========================
     APPROVE USER
  ========================= */
  const approveUser = async (id) => {
    try {
      const response = await axiosInstance.put(`/admin/approve/${id}`);
      toast.success(response.data.message);
      fetchPending();
      fetchAnalytics();
    } catch (error) {
      toast.error("Approval failed");
    }
  };

  useEffect(() => {
    fetchPending();
    fetchAnalytics();
  }, []);

  if (!analytics) return <p>Loading dashboard...</p>;

  return (
    <div className="space-y-10">

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold">
        Admin Dashboard
      </h1>

      {/* =======================
          STATS CARDS
      ======================= */}

      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">

        <div className="bg-white border rounded-lg p-6">
          <p className="text-sm text-gray-500">Total Users</p>
          <h2 className="text-2xl font-bold">
            {analytics.totals.total_users}
          </h2>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <p className="text-sm text-gray-500">Courses</p>
          <h2 className="text-2xl font-bold">
            {analytics.totals.total_courses}
          </h2>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <p className="text-sm text-gray-500">Modules</p>
          <h2 className="text-2xl font-bold">
            {analytics.totals.total_modules}
          </h2>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <p className="text-sm text-gray-500">Enrollments</p>
          <h2 className="text-2xl font-bold">
            {analytics.totals.total_enrollments}
          </h2>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <p className="text-sm text-gray-500">Assessments Passed</p>
          <h2 className="text-2xl font-bold">
            {analytics.totals.passed_assessments}
          </h2>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <p className="text-sm text-gray-500">Certificates Issued</p>
          <h2 className="text-2xl font-bold">
            {analytics.totals.certificates_issued}
          </h2>
        </div>

      </div>

      {/* =======================
          PLATFORM OVERVIEW
      ======================= */}

      <AnalyticsChart
        title="Platform Overview"
        labels={[
          "Users",
          "Courses",
          "Modules",
          "Enrollments",
          "Assessments Passed",
          "Certificates"
        ]}
        data={[
          analytics.totals.total_users,
          analytics.totals.total_courses,
          analytics.totals.total_modules,
          analytics.totals.total_enrollments,
          analytics.totals.passed_assessments,
          analytics.totals.certificates_issued
        ]}
      />

      {/* =======================
          USER GROWTH
      ======================= */}

      <AnalyticsChart
        title="User Growth"
        labels={analytics.user_growth.map((d) => d.date)}
        data={analytics.user_growth.map((d) => d.users)}
      />

      {/* =======================
          COURSE ENROLLMENTS
      ======================= */}

      <AnalyticsChart
        title="Course Enrollments"
        labels={analytics.course_enrollments.map((c) => c.title)}
        data={analytics.course_enrollments.map((c) => c.enrollments)}
      />

      {/* =======================
          PENDING USERS
      ======================= */}

      <div className="bg-white border rounded-lg p-6">

        <h2 className="text-xl font-semibold mb-6">
          Pending User Approvals
        </h2>

        {pendingUsers.length === 0 && (
          <p className="text-gray-500">
            No pending users
          </p>
        )}

        <div className="space-y-4">

          {pendingUsers.map((user) => (
            <div
              key={user.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {user.name}
                </p>

                <p className="text-sm text-gray-600">
                  {user.email}
                </p>

                <p className="text-sm">
                  Category: {user.business_category}
                </p>
              </div>

              <button
                onClick={() => approveUser(user.id)}
                className="bg-black text-white px-4 py-2 rounded-md"
              >
                Approve
              </button>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;