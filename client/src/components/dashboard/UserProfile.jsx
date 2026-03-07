import { useSelector } from "react-redux";

const UserProfile = () => {

  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">User Profile</h2>

      <div className="border p-6 rounded-lg space-y-3">

        <p><strong>Name:</strong> {user?.name}</p>

        <p><strong>Email:</strong> {user?.email}</p>

        <p><strong>Role:</strong> {user?.role}</p>

        <p><strong>Department:</strong> {user?.business_category}</p>

      </div>
    </div>
  );
};

export default UserProfile;