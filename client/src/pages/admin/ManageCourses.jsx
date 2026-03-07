import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const ManageCourses = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

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
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory) {
      return toast.error("Select a category first");
    }

    try {
      const res = await axiosInstance.post("/courses", {
        ...formData,
        category_id: selectedCategory,
      });

      toast.success(res.data.message);
      setFormData({ title: "", description: "" });
      fetchCourses(selectedCategory);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

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
          <form onSubmit={handleSubmit} className="space-y-3 mb-6">
            <input
              type="text"
              placeholder="Course title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="border px-3 py-2 rounded-md w-full"
            />

            <textarea
              placeholder="Course description"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              className="border px-3 py-2 rounded-md w-full"
            />

            <button className="bg-black text-white px-4 py-2 rounded-md">
              Create Course
            </button>
          </form>

          {/* Course List */}
          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="border p-4 rounded-md"
              >
                <h3 className="font-semibold">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {course.description}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageCourses;