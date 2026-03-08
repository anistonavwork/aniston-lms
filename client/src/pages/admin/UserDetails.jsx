import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const UserDetails = () => {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [certificates, setCertificates] = useState([]);

  /* =========================
     FETCH USER DETAILS
  ========================= */
  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get(`/admin/users/${id}`);
      setUser(res.data.user);
      setCourses(res.data.courses);
      setAssessments(res.data.assessments);
      setCertificates(res.data.certificates);
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

        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Category:</strong> {user.business_category}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>

      {/* COURSE PROGRESS */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-6">Course Progress</h2>

        {courses.length === 0 && <p>No courses enrolled.</p>}

        <div className="space-y-6">
          {courses.map((course) => (
            <div key={course.course_id}>
              <div className="flex justify-between mb-1">
                <span className="font-medium">{course.title}</span>

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

      {/* ASSESSMENTS */}

<div className="bg-white border rounded-lg p-6">
  <h2 className="text-xl font-bold mb-4">Assessment Results</h2>

  {assessments.length === 0 && (
    <p>No assessments taken.</p>
  )}

  <div className="space-y-2">

    {assessments.map((a, i) => (

      <div key={i} className="flex justify-between border-b pb-2">

        <span>Level {a.level}</span>

        <span>Score: {a.score}</span>

        <span className={a.passed ? "text-green-600" : "text-red-600"}>
          {a.passed ? "Passed" : "Failed"}
        </span>

        <span>
          {new Date(a.taken_at).toLocaleDateString()}
        </span>

      </div>

    ))}

  </div>
</div>

{/* CERTIFICATES */}

<div className="bg-white border rounded-lg p-6">
  <h2 className="text-xl font-bold mb-4">Certificates</h2>

  {certificates.length === 0 && (
    <p>No certificates issued.</p>
  )}

  <div className="space-y-2">

    {certificates.map((c, i) => (

      <div key={i}>

        Level {c.level} —

        <a
          href={c.certificate_url}
          target="_blank"
          className="text-blue-600 ml-2"
        >
          Download Certificate
        </a>

      </div>

    ))}

  </div>
</div>
    </div>
  );
};

export default UserDetails;
