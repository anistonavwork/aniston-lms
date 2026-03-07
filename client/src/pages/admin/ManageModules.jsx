import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const ManageModules = () => {

  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    course_id: "",
    lecture_order: "",
    content_type: "video",
    video_url: ""
  });

  const [file, setFile] = useState(null);

  /* =============================
     FETCH COURSES
  ============================= */

  const fetchCourses = async () => {

    try {

      const res = await axiosInstance.get("/courses/tree/all");

      const courseList = [];

      res.data.forEach(level => {
        level.categories.forEach(cat => {
          cat.courses.forEach(course => {
            courseList.push(course);
          });
        });
      });

      setCourses(courseList);

    } catch {

      toast.error("Failed to load courses");

    }

  };

  useEffect(() => {
    fetchCourses();
  }, []);

  /* =============================
     HANDLE INPUT
  ============================= */

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

  };

  /* =============================
     HANDLE FILE
  ============================= */

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  /* =============================
     SUBMIT MODULE
  ============================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data = new FormData();

      data.append("title", formData.title);
      data.append("course_id", formData.course_id);
      data.append("lecture_order", formData.lecture_order);
      data.append("content_type", formData.content_type);

      if (formData.video_url) {
        data.append("video_url", formData.video_url);
      }

      if (file) {
        data.append("file", file);
      }

      const res = await axiosInstance.post(
        "/modules",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(res.data.message);

      setFormData({
        title: "",
        course_id: "",
        lecture_order: "",
        content_type: "video",
        video_url: ""
      });

      setFile(null);

    } catch (err) {

      toast.error(err.response?.data?.message || "Upload failed");

    }

  };

  /* =============================
     UI
  ============================= */

  return (

    <div>

      <h2 className="text-xl font-bold mb-6">
        Manage Modules
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl"
      >

        <input
          type="text"
          name="title"
          placeholder="Module title"
          value={formData.title}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <select
          name="course_id"
          value={formData.course_id}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >

          <option value="">
            Select Course
          </option>

          {courses.map(course => (

            <option key={course.id} value={course.id}>
              {course.title}
            </option>

          ))}

        </select>

        <input
          type="number"
          name="lecture_order"
          placeholder="Lecture order"
          value={formData.lecture_order}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <select
          name="content_type"
          value={formData.content_type}
          onChange={handleChange}
          className="border p-2 rounded"
        >

          <option value="video">
            YouTube Video
          </option>

          <option value="pdf">
            PDF / PPT Upload
          </option>

        </select>

        {formData.content_type === "video" && (

          <input
            type="text"
            name="video_url"
            placeholder="YouTube URL"
            value={formData.video_url}
            onChange={handleChange}
            className="border p-2 rounded md:col-span-2"
          />

        )}

        {formData.content_type === "pdf" && (

          <input
            type="file"
            onChange={handleFile}
            className="md:col-span-2"
            required
          />

        )}

        <button className="bg-black text-white px-4 py-2 rounded md:col-span-2">
          Upload Module
        </button>

      </form>

    </div>

  );

};

export default ManageModules;