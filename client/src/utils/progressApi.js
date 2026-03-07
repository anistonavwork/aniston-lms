import axiosInstance from "./axiosInstance";

/*
---------------------------------------
MARK MODULE COMPLETE
---------------------------------------
*/
export const completeModule = async (course_id, module_id) => {
  const res = await axiosInstance.post("/progress/complete-module", {
    course_id,
    module_id,
  });

  return res.data;
};

/*
---------------------------------------
GET COURSE PROGRESS
---------------------------------------
*/
export const getCourseProgress = async (courseId) => {
  const res = await axiosInstance.get(`/progress/course/${courseId}`);
  return res.data;
};

/*
---------------------------------------
GET NEXT MODULE (SEQUENTIAL LEARNING)
---------------------------------------
*/
export const getNextModule = async (courseId) => {
  const res = await axiosInstance.get(`/progress/next-module/${courseId}`);
  return res.data;
};