import express from "express";
import {
  enrollCourse,
  getMyCourses
} from "../controllers/enrollmentController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/*
---------------------------------------
ENROLL IN COURSE
---------------------------------------
POST /api/enrollments/enroll
*/
router.post("/enroll", protect, enrollCourse);

/*
---------------------------------------
GET MY ENROLLED COURSES
---------------------------------------
GET /api/enrollments/my-courses
*/
router.get("/my-courses", protect, getMyCourses);

export default router;