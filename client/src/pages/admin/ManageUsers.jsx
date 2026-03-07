import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  /* =========================
     FETCH USERS
  ========================= */
  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to load users");
    }
  };

  /* =========================
     DELETE USER
  ========================= */
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await axiosInstance.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Manage Users
      </h2>

      <div className="bg-white border rounded-lg overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Role</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>

          <tbody>

            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t"
              >
                <td className="p-4">
                  {user.name}
                </td>

                <td className="p-4">
                  {user.email}
                </td>

                <td className="p-4">
                  {user.business_category}
                </td>

                <td className="p-4">
                  {user.role}
                </td>

                <td className="p-4 space-x-4">

                  {/* VIEW USER */}
                  <button
                    onClick={() =>
                      navigate(`/admin/users/${user.id}`)
                    }
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>

                  {/* DELETE USER */}
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-600 hover:underline"
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