import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchCourseProgress,
  fetchNextModule,
  markModuleComplete,
} from "../../features/progressSlice";

const BASE_URL = axiosInstance.defaults.baseURL.replace("/api", "");

const UserDashboard = () => {
  const dispatch = useDispatch();

  const { completedModules, progressPercent } = useSelector(
    (state) => state.progress,
  );

  const [levels, setLevels] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const [modules, setModules] = useState({});
  const [flatModules, setFlatModules] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [activeModule, setActiveModule] = useState(null);

  /* ================= LMS TREE ================= */
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

  /* ================= ENROLLMENTS ================= */
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await axiosInstance.get("/courses/my-courses");
        const ids = res.data.map((c) => c.id);
        setEnrolledCourses(ids);
      } catch {
        toast.error("Failed to load enrollments");
      }
    };

    fetchEnrollments();
  }, []);

  /* ================= COURSES ================= */
  const fetchCourses = async (categoryId) => {
    try {
      const res = await axiosInstance.get(`/courses/${categoryId}`);

      setCourses(res.data);
      setSelectedCategory(categoryId);
      setSelectedCourse(null);
      setModules({});
      setActiveModule(null);
    } catch {
      toast.error("Failed to load courses");
    }
  };

  /* ================= MODULES ================= */
  const fetchModules = async (courseId) => {
    try {
      const res = await axiosInstance.get(`/modules/${courseId}`);

      setModules(res.data);
      setSelectedCourse(courseId);

      const flattened = Object.values(res.data).flat();
      setFlatModules(flattened);

      if (flattened.length > 0) {
        setActiveModule(flattened[0]);
      }
    } catch {
      toast.error("Failed to load modules");
    }
  };

  /* ================= PROGRESS ================= */
  useEffect(() => {
    if (selectedCourse) {
      dispatch(fetchCourseProgress(selectedCourse));
      dispatch(fetchNextModule(selectedCourse));
    }
  }, [selectedCourse, dispatch]);

  /* ================= COMPLETE MODULE ================= */
  const handleCompleteModule = async (moduleId) => {
    try {
      await dispatch(
        markModuleComplete({
          course_id: selectedCourse,
          module_id: moduleId,
        }),
      );

      toast.success("Module completed");
    } catch {
      toast.error("Failed to complete module");
    }
  };

  /* ================= ENROLL ================= */
  const enrollCourse = async (courseId) => {
    try {
      await axiosInstance.post("/enrollments/enroll", {
        course_id: courseId,
      });

      toast.success("Enrollment successful");

      setEnrolledCourses((prev) => [...prev, courseId]);
    } catch {
      toast.error("Enrollment failed");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Learning Dashboard</h2>

      {/* LEVELS */}
      {!selectedCategory && (
        <div className="space-y-8">
          {levels.map((level) => (
            <div key={level.id}>
              <h2 className="text-xl font-bold mb-4">{level.name}</h2>

              <div className="grid md:grid-cols-3 gap-6">
                {level.categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => fetchCourses(cat.id)}
                    className="border p-6 rounded-lg cursor-pointer hover:shadow-md"
                  >
                    <h3 className="font-semibold text-lg">{cat.name}</h3>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* COURSES */}
      {selectedCategory && !selectedCourse && (
        <div>
          <button
            onClick={() => {
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
                <div key={course.id} className="border p-6 rounded-lg">
                  <h3 className="font-semibold text-lg">{course.title}</h3>

                  <p className="text-sm text-gray-600 mt-2">
                    {course.description}
                  </p>

                  {/* PROGRESS BAR */}

                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      Progress: {progressPercent}%
                    </p>
                  </div>

                  <div className="mt-4">
                    {!isEnrolled && (
                      <button
                        onClick={() => enrollCourse(course.id)}
                        className="bg-black text-white px-4 py-2 rounded"
                      >
                        Enroll
                      </button>
                    )}

                    {isEnrolled && (
                      <button
                        onClick={() => fetchModules(course.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded"
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

      {/* MODULE PLAYER */}
      {selectedCourse && (
        <div>
          <button
            onClick={() => {
              setSelectedCourse(null);
              setModules({});
            }}
            className="mb-4 text-sm underline"
          >
            ← Back to Courses
          </button>

          <div className="grid md:grid-cols-3 gap-6">
            {/* SIDEBAR */}
            <div className="border rounded-lg p-4 space-y-4 bg-white">
              {Object.entries(modules).map(([step, stepModules]) => (
                <div key={step} className="mb-4">
                  {/* STEP TITLE */}

                  <h4 className="font-semibold text-sm text-gray-700 mb-2 border-b pb-1">
                    {step}
                  </h4>

                  {/* LECTURES */}

                  {stepModules.map((mod) => {
                    const index = flatModules.findIndex((m) => m.id === mod.id);

                    const isUnlocked =
                      index === 0 ||
                      completedModules.includes(flatModules[index - 1]?.id);

                    const isCompleted = completedModules.includes(mod.id);

                    return (
                      <div
                        key={mod.id}
                        onClick={() => {
                          if (isUnlocked) setActiveModule(mod);
                        }}
                        className={`flex items-center justify-between p-2 border rounded cursor-pointer mb-2 transition
            ${
              activeModule?.id === mod.id
                ? "bg-blue-50 border-blue-400"
                : "hover:bg-gray-50"
            }`}
                      >
                        <span className="text-sm">
                          ▶ Lecture {mod.lecture_order} — {mod.title}
                        </span>

                        <div>
                          {isCompleted && (
                            <span className="text-green-600 text-sm">✔</span>
                          )}

                          {!isUnlocked && (
                            <span className="text-red-500 text-sm">🔒</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* PLAYER */}
            <div className="md:col-span-2 border rounded-lg p-6 bg-white">
              {activeModule && (
                <>
                  <h3 className="font-semibold mb-4">{activeModule.title}</h3>

                  {activeModule.file_path && (
                    <iframe
                      src={`${BASE_URL}/${activeModule.file_path}`}
                      className="w-full h-[650px] border rounded shadow"
                      title={activeModule.title}
                    />
                  )}

                  {!completedModules.includes(activeModule.id) && (
                    <button
                      onClick={() => handleCompleteModule(activeModule.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded mt-4"
                    >
                      Mark as Completed
                    </button>
                  )}

                  {/* NEXT LECTURE BUTTON */}

                  {completedModules.includes(activeModule.id) && (
                    <button
                      onClick={() => {
                        const index = flatModules.findIndex(
                          (m) => m.id === activeModule.id,
                        );

                        const nextModule = flatModules[index + 1];

                        if (nextModule) {
                          setActiveModule(nextModule);
                        }
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded mt-4 ml-3"
                    >
                      Next Lecture →
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
