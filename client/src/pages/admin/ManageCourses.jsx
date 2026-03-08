import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);

  const navigate = useNavigate();

  /* =========================
     FETCH COURSES
  ========================= */

  const fetchCourses = async () => {
    try {
      const res = await axiosInstance.get("/courses/tree/all");

      const allCourses = [];

      res.data.forEach((level) => {
        level.categories?.forEach((category) => {
          category.courses?.forEach((course) => {
            allCourses.push(course);
          });
        });
      });

      setCourses(allCourses);
    } catch {
      toast.error("Failed to load courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  /* =========================
     DELETE COURSE
  ========================= */

  const deleteCourse = async (courseId) => {
    if (!window.confirm("Delete this course?")) return;

    try {
      await axiosInstance.delete(`/admin/courses/${courseId}`);

      toast.success("Course deleted");

      fetchCourses();
    } catch {
      toast.error("Failed to delete course");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Manage Courses</h2>

      <div className="space-y-4">
        {courses.length === 0 ? (
          <div className="text-gray-500 text-sm border rounded-md p-4 bg-white">
            No courses created yet.
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="border p-4 rounded-md flex justify-between items-center bg-white"
            >
              <div>
                <h3 className="font-semibold">{course.title}</h3>

                <p className="text-sm text-gray-600">{course.description}</p>

                <p className="text-xs text-gray-500 mt-1">
                  Level: {course.level_id}
                </p>

                <p className="text-xs text-gray-500">
                  Modules: {course.module_count || 0}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate(`/admin/edit-course/${course.id}`)}
                  className="text-blue-600 text-sm"
                >
                  Edit Modules
                </button>

                <button
                  onClick={() => deleteCourse(course.id)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageCourses;
