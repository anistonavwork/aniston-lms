import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ManageUsers = () => {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to load users");
    }
  };

  const deleteUser = async (id) => {
    try {

      await axiosInstance.delete(`/admin/users/${id}`);

      toast.success("User deleted");

      fetchUsers();

    } catch (error) {

      toast.error("Delete failed");

    }
  };

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Designation</th>
              <th className="p-3 text-left">Courses</th>
              <th className="p-3 text-left">Progress</th>
              <th className="p-3 text-left">Score</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr key={user.id} className="border-t">

                <td className="p-3">{user.name}</td>

                <td className="p-3">{user.email}</td>

                <td className="p-3">
                  {user.designation || "-"}
                </td>

                <td className="p-3">
                  {user.courses_enrolled || 0}
                </td>

                <td className="p-3">
                  {user.progress || 0}%
                </td>

                <td className="p-3">
                  {user.assessment_score || "-"}
                </td>

                <td className="p-3">

                  {user.is_approved ? (
                    <span className="text-green-600">Active</span>
                  ) : (
                    <span className="text-yellow-600">Pending</span>
                  )}

                </td>

                <td className="p-3 flex gap-3">

                  <Link
                    to={`/admin/users/${user.id}`}
                    className="text-blue-600"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-600"
                  >
                    Delete
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

export default ManageUsers;