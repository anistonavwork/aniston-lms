import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const ManageCategories = () => {

  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [designations, setDesignations] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    level_id: "",
    designation_id: ""
  });

  /* =============================
     FETCH CATEGORIES
  ============================= */

 const fetchCategories = async () => {

  try {

    const res = await axiosInstance.get("/courses/tree/all");

    const categoryList = [];

    res.data.forEach(level => {

      level.categories.forEach(cat => {

        categoryList.push({
          ...cat,
          level_name: level.name
        });

      });

    });

    setCategories(categoryList);

  } catch {

    toast.error("Failed to load categories");

  }

};

  /* =============================
     FETCH LEVELS + DESIGNATIONS
  ============================= */

  const fetchMetaData = async () => {

    try {

      const levelRes = await axiosInstance.get("/admin/levels");
      const desigRes = await axiosInstance.get("/admin/designations");

      setLevels(levelRes.data);
      setDesignations(desigRes.data);

    } catch {

      toast.error("Failed to load levels/designations");

    }

  };


  /* =============================
     HANDLE INPUT CHANGE
  ============================= */

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

  };


  /* =============================
     CREATE CATEGORY
  ============================= */

  const handleCreate = async (e) => {

    e.preventDefault();

    try {

      const payload = {
        name: formData.name,
        level_id: formData.level_id,
        designation_id:
          parseInt(formData.level_id) === 2
            ? formData.designation_id
            : null
      };

      const res = await axiosInstance.post("/categories", payload);

      toast.success(res.data.message);

      setFormData({
        name: "",
        level_id: "",
        designation_id: ""
      });

      fetchCategories();

    } catch (err) {

      toast.error(err.response?.data?.message || "Error creating category");

    }

  };


  /* =============================
     INITIAL LOAD
  ============================= */

  useEffect(() => {

    fetchCategories();
    fetchMetaData();

  }, []);


  /* =============================
     UI
  ============================= */

  return (

    <div>

      <h2 className="text-xl font-bold mb-6">
        Manage Categories
      </h2>


      {/* CREATE CATEGORY */}

      <form
        onSubmit={handleCreate}
        className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl"
      >

        {/* CATEGORY NAME */}

        <input
          type="text"
          name="name"
          placeholder="Category name"
          value={formData.name}
          onChange={handleChange}
          className="border px-3 py-2 rounded-md"
          required
        />


        {/* LEVEL SELECT */}

        <select
          name="level_id"
          value={formData.level_id}
          onChange={handleChange}
          className="border px-3 py-2 rounded-md"
          required
        >

          <option value="">
            Select Level
          </option>

          {levels.map((level) => (

            <option key={level.id} value={level.id}>
              {level.name}
            </option>

          ))}

        </select>


        {/* DESIGNATION SELECT */}

        {parseInt(formData.level_id) === 2 && (

          <select
            name="designation_id"
            value={formData.designation_id}
            onChange={handleChange}
            className="border px-3 py-2 rounded-md"
            required
          >

            <option value="">
              Select Designation
            </option>

            {designations.map((d) => (

              <option key={d.id} value={d.id}>
                {d.name}
              </option>

            ))}

          </select>

        )}


        {/* SUBMIT BUTTON */}

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-md md:col-span-3 w-fit"
        >
          Add Category
        </button>

      </form>


      {/* CATEGORY LIST */}

      <div className="space-y-3">

        {categories.map((cat) => (

          <div
            key={cat.id}
            className="border p-3 rounded-md flex justify-between items-center"
          >

            <div>

              <p className="font-medium">
                {cat.name}
              </p>

              <p className="text-sm text-gray-500">
                Level: {cat.level_name}
                {cat.designation_id
                  ? ` | Designation ID: ${cat.designation_id}`
                  : ""}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

};

export default ManageCategories;