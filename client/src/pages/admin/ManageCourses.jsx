import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ManageCourses = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [courses, setCourses] = useState([]);

  const navigate = useNavigate();

  /* =======================
     FETCH CATEGORIES
  ======================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/categories");
        setCategories(res.data);
      } catch {
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  /* =======================
     FETCH COURSES
  ======================= */
  const fetchCourses = async (categoryId) => {
    try {
      const res = await axiosInstance.get(`/courses/${categoryId}`);
      setCourses(res.data);
    } catch {
      toast.error("Failed to load courses");
    }
  };

  /* =======================
     HANDLE CATEGORY SELECT
  ======================= */
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    if (categoryId) fetchCourses(categoryId);
  };

  /* =======================
     CREATE COURSE
  ======================= */

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Manage Courses</h2>

      {/* Category Selector */}
      <div className="mb-6">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border px-3 py-2 rounded-md"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Create Course */}
      {selectedCategory && (
        <>
          {/* Course List */}
          <div className="space-y-3">
            {courses.length === 0 ? (
              <div className="text-gray-500 text-sm border rounded-md p-4 bg-white">
                No courses found in this category.
              </div>
            ) : (
              <div className="space-y-3">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="border p-4 rounded-md flex justify-between items-center bg-white"
                  >
                    <div>
                      <h3 className="font-semibold">{course.title}</h3>

                      <p className="text-sm text-gray-600">
                        {course.description}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Modules: {course.module_count || 0}
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() =>
                          navigate(`/admin/edit-course/${course.id}`)
                        }
                        className="text-blue-600 text-sm"
                      >
                        Edit Modules
                      </button>

                      <button className="text-red-600 text-sm">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageCourses;
