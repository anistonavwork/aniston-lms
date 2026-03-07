import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchCourseProgress,
  fetchNextModule,
  markModuleComplete,
} from "../../features/progressSlice";

/* ==========================
   BASE URL (NO HARDCODED LOCALHOST)
========================== */
const BASE_URL = axiosInstance.defaults.baseURL.replace("/api", "");

const UserDashboard = () => {
  const dispatch = useDispatch();

  const { completedModules, nextModule, progressPercent } = useSelector(
    (state) => state.progress,
  );

  const [levels, setLevels] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [modules, setModules] = useState([]);

  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [activeModule, setActiveModule] = useState(null);

  /* ==========================
     FETCH LMS TREE (LEVELS)
  ========================== */
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const res = await axiosInstance.get("/courses/tree/all");
        setLevels(res.data);
      } catch {
        toast.error("Failed to load LMS content");
      }
    };

    fetchLevels();
  }, []);

  /* ==========================
   FETCH USER ENROLLMENTS
  ========================== */
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await axiosInstance.get("/enrollments/my-courses");
        const ids = res.data.map((c) => c.id);
        setEnrolledCourses(ids);
      } catch {
        toast.error("Failed to load enrollments");
      }
    };

    fetchEnrollments();
  }, []);

  /* ==========================
     FETCH COURSES
  ========================== */
  const fetchCourses = async (categoryId, levelId) => {
    try {
      const res = await axiosInstance.get(`/courses/${categoryId}`);

      setCourses(res.data);
      setSelectedLevel(levelId);
      setSelectedCategory(categoryId);

      setSelectedCourse(null);
      setModules([]);
      setActiveModule(null);
    } catch {
      toast.error("Failed to load courses");
    }
  };

  /* ==========================
     FETCH MODULES
  ========================== */
  const fetchModules = async (courseId) => {
    try {
      const res = await axiosInstance.get(`/modules/${courseId}`);

      setModules(res.data);
      setSelectedCourse(courseId);

      if (res.data.length > 0) {
        setActiveModule(res.data[0]);
      }
    } catch {
      toast.error("Failed to load modules");
    }
  };

  /* ==========================
     LOAD PROGRESS
  ========================== */
  useEffect(() => {
    if (selectedCourse) {
      dispatch(fetchCourseProgress(selectedCourse));
      dispatch(fetchNextModule(selectedCourse));
    }
  }, [selectedCourse, dispatch]);

  /* ==========================
     COMPLETE MODULE
  ========================== */
  const handleCompleteModule = async (moduleId) => {
    try {
      await dispatch(
        markModuleComplete({
          course_id: selectedCourse,
          module_id: moduleId,
        }),
      );

      dispatch(fetchNextModule(selectedCourse));

      toast.success("Module completed");
    } catch {
      toast.error("Failed to complete module");
    }
  };

  /* ==========================
   ENROLL COURSE
  ========================== */
  const enrollCourse = async (courseId) => {
    try {
      await axiosInstance.post("/enrollments/enroll", {
        course_id: courseId,
      });

      toast.success("Enrollment successful");

      setEnrolledCourses((prev) =>
        prev.includes(courseId) ? prev : [...prev, courseId],
      );
    } catch {
      toast.error("Enrollment failed");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Learning Dashboard</h2>

      {/* ================= LEVELS ================= */}
      {!selectedCategory && (
        <div className="space-y-8">
          {levels.map((level) => (
            <div key={level.id}>
              <h2 className="text-xl font-bold mb-4">{level.name}</h2>

              <div className="grid md:grid-cols-3 gap-6">
                {level.categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => fetchCourses(cat.id, level.id)}
                    className="border p-6 rounded-lg cursor-pointer hover:shadow-md transition"
                  >
                    <h3 className="font-semibold text-lg">{cat.name}</h3>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= COURSES ================= */}
      {selectedCategory && !selectedCourse && (
        <div>
          <button
            onClick={() => {
              setSelectedLevel(null);
              setSelectedCategory(null);
              setCourses([]);
            }}
            className="mb-4 text-sm underline"
          >
            ← Back to Levels
          </button>

          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((course) => {
              const isEnrolled = enrolledCourses.includes(course.id);

              return (
                <div
                  key={course.id}
                  className="border p-6 rounded-lg bg-white hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-lg">{course.title}</h3>

                  <p className="text-sm text-gray-600 mt-2">
                    {course.description}
                  </p>

                  {isEnrolled && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>

                      <p className="text-xs text-gray-500 mt-1">
                        Progress: {progressPercent}%
                      </p>

                      {progressPercent === 100 && (
                        <p className="text-green-600 text-sm font-semibold mt-1">
                          ✔ Course Completed
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-4">
                    {!isEnrolled && (
                      <button
                        onClick={() => enrollCourse(course.id)}
                        className="bg-black text-white px-4 py-2 rounded hover:opacity-90"
                      >
                        Enroll
                      </button>
                    )}

                    {isEnrolled && (
                      <button
                        onClick={() => fetchModules(course.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Start Learning
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= MODULES ================= */}
      {selectedCourse && (
        <div>
          <button
            onClick={() => {
              setSelectedCourse(null);
              setModules([]);
              setActiveModule(null);
            }}
            className="mb-4 text-sm underline"
          >
            ← Back to Courses
          </button>

          <div className="grid md:grid-cols-3 gap-6">
            {/* SIDEBAR */}
            <div className="md:col-span-1 border rounded-lg p-4 space-y-3 h-fit">
              {modules.map((mod, index) => {
                const isCompleted = completedModules.includes(mod.id);

                const isUnlocked =
                  index === 0 ||
                  completedModules.includes(modules[index - 1]?.id);

                return (
                  <div
                    key={mod.id}
                    onClick={() => {
                      if (isUnlocked) setActiveModule(mod);
                    }}
                    className={`p-3 rounded cursor-pointer border ${
                      activeModule?.id === mod.id
                        ? "bg-blue-50 border-blue-400"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{mod.title}</span>

                      {isCompleted && <span className="text-green-600">✔</span>}

                      {!isUnlocked && <span className="text-red-500">🔒</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PLAYER */}
            <div className="md:col-span-2 border rounded-lg p-6 bg-white shadow-sm">
              {activeModule && (
                <>
                  <h3 className="font-semibold mb-4">{activeModule.title}</h3>

                  {/* VIDEO */}
                  {activeModule.video_url && (
                    <div className="aspect-video mb-4">
                      <iframe
                        className="w-full h-full rounded-md"
                        src={
                          activeModule.video_url.includes("watch?v=")
                            ? activeModule.video_url.replace(
                                "watch?v=",
                                "embed/",
                              )
                            : activeModule.video_url
                        }
                        title={activeModule.title}
                        allowFullScreen
                      />
                    </div>
                  )}

                  {/* PDF VIEWER */}
                  {activeModule.file_path &&
                    activeModule.file_path.endsWith(".pdf") && (
                      <iframe
                        src={`${BASE_URL}/${activeModule.file_path}`}
                        className="w-full h-[600px] border rounded mb-4"
                        title="PDF Viewer"
                      />
                    )}

                  {/* PPT VIEWER */}
                  {activeModule.file_path &&
                    (activeModule.file_path.endsWith(".ppt") ||
                      activeModule.file_path.endsWith(".pptx")) && (
                      <iframe
                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${BASE_URL}/${activeModule.file_path}`}
                        className="w-full h-[600px] border rounded mb-4"
                        title="PPT Viewer"
                      />
                    )}

                  {/* DOWNLOAD FILE */}
                  {activeModule.file_path && (
                    <a
                      href={`${BASE_URL}/${activeModule.file_path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline block mb-4"
                    >
                      Download File
                    </a>
                  )}

                  {!completedModules.includes(activeModule.id) && (
                    <button
                      onClick={() => handleCompleteModule(activeModule.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Mark as Completed
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
