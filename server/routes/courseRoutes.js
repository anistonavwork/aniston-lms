import express from "express";
import {
  createCourse,
  getCoursesByCategory,
  getCourseTree,
  getMyCourses
} from "../controllers/courseController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/* ================= ADMIN ================= */

router.post("/", protect, authorize("admin"), createCourse);

/* ================= PUBLIC ================= */

router.get("/tree/all", protect, getCourseTree);

/* ================= USER ================= */

router.get("/my-courses", protect, getMyCourses);

/* ================= CATEGORY COURSES ================= */

router.get("/:categoryId", getCoursesByCategory);

export default router;