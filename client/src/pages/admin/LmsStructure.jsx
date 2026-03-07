import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const LmsStructure = () => {

  const [structure, setStructure] = useState([]);

  const fetchStructure = async () => {

    try {

      const res = await axiosInstance.get("/admin/lms-structure");

      setStructure(res.data);

    } catch {

      toast.error("Failed to load LMS structure");

    }

  };

  const deleteModule = async (id) => {

    if (!window.confirm("Delete this module?")) return;

    try {

      await axiosInstance.delete(`/modules/${id}`);

      toast.success("Module deleted");

      fetchStructure();

    } catch {

      toast.error("Delete failed");

    }

  };

  useEffect(() => {
    fetchStructure();
  }, []);

  return (

    <div>

      <h2 className="text-2xl font-bold mb-6">
        LMS Structure
      </h2>

      {structure.length === 0 && (
        <p className="text-gray-500">No LMS content found</p>
      )}

      <div className="space-y-6">

        {structure.map((level) => (

          <div key={level.id} className="border rounded p-4">

            <h3 className="text-lg font-bold mb-4">
              {level.name}
            </h3>

            {level.categories.length === 0 && (
              <p className="text-gray-400">
                No categories
              </p>
            )}

            {level.categories.map((cat) => (

              <div key={cat.id} className="ml-6 mb-4">

                <h4 className="font-semibold">
                  {cat.name}
                </h4>

                {cat.courses.map((course) => (

                  <div key={course.id} className="ml-6 mb-3">

                    <p className="font-medium">
                      {course.title}
                    </p>

                    {course.modules.length === 0 && (
                      <p className="text-sm text-gray-400 ml-4">
                        No modules
                      </p>
                    )}

                    {course.modules.map((mod) => (

                      <div
                        key={mod.id}
                        className="ml-6 flex justify-between items-center border p-2 rounded mb-2"
                      >

                        <span>
                          {mod.lecture_order}. {mod.title}
                        </span>

                        <button
                          onClick={() => deleteModule(mod.id)}
                          className="text-red-600 text-sm"
                        >
                          Delete
                        </button>

                      </div>

                    ))}

                  </div>

                ))}

              </div>

            ))}

          </div>

        ))}

      </div>

    </div>

  );

};

export default LmsStructure;