import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const CourseLearning = () => {
  const { id } = useParams();

  const [modules, setModules] = useState([]);
  const [currentModule, setCurrentModule] = useState(null);

  /* =========================
     FETCH MODULES
  ========================= */

  const fetchModules = async () => {
    try {
      const res = await axiosInstance.get(`/modules/${id}`);

      setModules(res.data);

      if (res.data.length > 0) {
        setCurrentModule(res.data[0]);
      }

    } catch (error) {
      toast.error("Failed to load modules");
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  /* =========================
     MARK MODULE COMPLETE
  ========================= */

  const completeModule = async (moduleId) => {
    try {

      await axiosInstance.post("/progress/complete-module", {
        module_id: moduleId,
        course_id: id
      });

      toast.success("Module completed");

    } catch (error) {
      toast.error("Failed to update progress");
    }
  };

  if (!currentModule) {
    return <p>Loading modules...</p>;
  }

  return (
    <div className="grid grid-cols-4 gap-8">

      {/* MODULE LIST */}
      <div className="col-span-1 bg-white border rounded-lg p-4">

        <h2 className="font-bold mb-4">
          Course Modules
        </h2>

        <div className="space-y-2">

          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => setCurrentModule(module)}
              className="block w-full text-left p-2 border rounded hover:bg-gray-100"
            >
              {module.title}
            </button>
          ))}

        </div>

      </div>

      {/* PLAYER */}
      <div className="col-span-3 space-y-6">

        <h2 className="text-xl font-bold">
          {currentModule.title}
        </h2>

        {/* VIDEO */}
        {currentModule.content_type === "youtube" && (
          <iframe
            className="w-full h-[500px]"
            src={currentModule.video_url}
            title="video"
            allowFullScreen
          />
        )}

        {/* FILE DOWNLOAD */}
        {currentModule.file_path && (
          <a
            href={`http://localhost:5000/${currentModule.file_path}`}
            target="_blank"
            className="text-blue-600 underline"
          >
            Open Learning Material
          </a>
        )}

        <button
          onClick={() => completeModule(currentModule.id)}
          className="bg-black text-white px-6 py-2 rounded"
        >
          Mark Complete
        </button>

      </div>

    </div>
  );
};

export default CourseLearning;