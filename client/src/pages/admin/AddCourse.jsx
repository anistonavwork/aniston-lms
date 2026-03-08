import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const AddCourse = () => {
  const [levels, setLevels] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [modules, setModules] = useState([
    {
      title: "",
      lecture_order: 1,
      file: null,
    },
  ]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    level_id: "",
    designation_id: "",
    department: "",
  });

  useEffect(() => {
    fetchLevels();
    fetchDesignations();
  }, []);

  const fetchLevels = async () => {
    const res = await axiosInstance.get("/admin/levels");
    setLevels(res.data);
  };

  const fetchDesignations = async () => {
    const res = await axiosInstance.get("/admin/designations");
    setDesignations(res.data);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const courseRes = await axiosInstance.post("/courses", {
        title: form.title,
        description: form.description,
        category_id: 1,
      });

      const courseId = courseRes.data.course_id;

      for (const module of modules) {
        if (!module.title) {
          toast.error("Module title required");
          return;
        }

        const formData = new FormData();

        formData.append("title", module.title);
        formData.append("lecture_order", module.lecture_order);
        formData.append("course_id", courseId);
        formData.append("content_type", "ppt");
        formData.append("file", module.file);

        await axiosInstance.post("/modules", formData);
      }

      toast.success("Course and modules created");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create course");
    }
  };

  const addModule = () => {
    setModules([
      ...modules,
      {
        title: "",
        lecture_order: modules.length + 1,
        file: null,
      },
    ]);
  };

  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...modules];
    updatedModules[index][field] = value;
    setModules(updatedModules);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add Course</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 space-y-6"
      >
        {/* COURSE TITLE */}

        <div>
          <label className="block mb-2 font-medium">Course Title</label>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* LEVEL */}

        <div>
          <label className="block mb-2 font-medium">Level</label>

          <select
            name="level_id"
            value={form.level_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Level</option>

            {levels.map((lvl) => (
              <option key={lvl.id} value={lvl.id}>
                {lvl.name}
              </option>
            ))}
          </select>
        </div>

        {/* DESIGNATION */}

        {form.level_id === "2" && (
          <div>
            <label className="block mb-2 font-medium">Designation</label>

            <select
              name="designation_id"
              value={form.designation_id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Designation</option>

              {designations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* DESCRIPTION */}

        <div>
          <label className="block mb-2 font-medium">Course Description</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* MODULES */}

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Modules</h2>

          {modules.map((module, index) => (
            <div key={index} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Module Title"
                value={module.title}
                onChange={(e) =>
                  handleModuleChange(index, "title", e.target.value)
                }
                className="border p-2 rounded"
              />

              <input
                type="number"
                placeholder="Lecture Order"
                value={module.lecture_order}
                onChange={(e) =>
                  handleModuleChange(index, "lecture_order", e.target.value)
                }
                className="border p-2 rounded"
              />
              <input
                type="file"
                accept=".ppt,.pptx,.pdf"
                onChange={(e) =>
                  handleModuleChange(index, "file", e.target.files[0])
                }
                className="border p-2 rounded col-span-2"
              />
            </div>
          ))}

          <button type="button" onClick={addModule} className="text-blue-600">
            + Add Module
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Create Course
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
