import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

const Home = () => {

  const [levels, setLevels] = useState([]);
  const navigate = useNavigate();

  /* =========================
     FETCH LMS TREE
  ========================= */

  const fetchCourses = async () => {

    try {

      const res = await axiosInstance.get("/courses/tree/all");

      setLevels(res.data);

    } catch (error) {
      toast.error("Failed to load courses");
    }

  };

  useEffect(() => {
    fetchCourses();
  }, []);

  /* =========================
     COURSE CLICK HANDLER
  ========================= */

const handleCourseClick = (courseId) => {

  const token = localStorage.getItem("token");

  if (!token) {
    toast.info("Please login or register first");
    return;
  }

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.is_approved) {
    toast.info("Your account is waiting for admin approval");
    return;
  }

  navigate(`/dashboard/course/${courseId}`);

};

  return (

    <div className="max-w-6xl mx-auto py-10 space-y-10">

      <h1 className="text-4xl font-bold text-center">
        Aniston LMS Portal
      </h1>

      {levels.map((level) => (

        <div key={level.id}>

          <h2 className="text-2xl font-semibold mb-4">
            {level.title}
          </h2>

          {level.categories.map((category) => (

            <div key={category.id} className="mb-6">

              <h3 className="text-xl font-semibold mb-2">
                {category.name}
              </h3>

              <div className="grid grid-cols-3 gap-4">

                {category.courses.map((course) => (

                  <div
                    key={course.id}
                    onClick={() => handleCourseClick(course.id)}
                    className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
                  >

                    <h4 className="font-bold">
                      {course.title}
                    </h4>

                    <p className="text-sm text-gray-600">
                      {course.description}
                    </p>

                    <p className="text-sm mt-2 text-gray-500">
                      {course.modules.length} Lectures
                    </p>

                  </div>

                ))}

              </div>

            </div>

          ))}

        </div>

      ))}

    </div>

  );

};

export default Home;