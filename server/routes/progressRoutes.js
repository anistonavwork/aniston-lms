import express from "express";
import {
  completeModule,
  getCourseProgress,
  getNextModule,
} from "../controllers/progressController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/*
---------------------------------------
COMPLETE MODULE
---------------------------------------
POST /api/progress/complete-module
*/
router.post("/complete-module", protect, completeModule);

/*
---------------------------------------
GET COURSE PROGRESS
---------------------------------------
GET /api/progress/course/:courseId
*/
router.get("/course/:courseId", protect, getCourseProgress);

/*
---------------------------------------
GET NEXT MODULE
---------------------------------------
GET /api/progress/next-module/:courseId
*/
router.get("/next-module/:courseId", protect, getNextModule);

export default router;