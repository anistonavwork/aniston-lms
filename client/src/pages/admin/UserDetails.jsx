import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const UserDetails = () => {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);

  /* =========================
     FETCH USER DETAILS
  ========================= */
  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get(`/admin/users/${id}`);
      setUser(res.data.user);
      setCourses(res.data.courses);
    } catch (error) {
      toast.error("Failed to load user details");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="space-y-8">
      {/* USER INFO */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">User Information</h2>

        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Category:</strong> {user.business_category}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      {/* COURSE PROGRESS */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-6">
          Course Progress
        </h2>

        {courses.length === 0 && (
          <p>No courses enrolled.</p>
        )}

        <div className="space-y-6">
          {courses.map((course) => (
            <div key={course.course_id}>

              <div className="flex justify-between mb-1">
                <span className="font-medium">
                  {course.title}
                </span>

                <span className="text-sm text-gray-600">
                  {course.progress}%
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full"
                  style={{
                    width: `${course.progress}%`,
                  }}
                ></div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;