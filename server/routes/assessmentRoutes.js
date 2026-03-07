import express from "express";
import {
  submitAssessment,
  getAssessmentResult
} from "../controllers/assessmentController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/*
---------------------------------------
SUBMIT ASSESSMENT
---------------------------------------
POST /api/assessment/submit
*/
router.post("/submit", protect, submitAssessment);

/*
---------------------------------------
GET ASSESSMENT RESULT
---------------------------------------
GET /api/assessment/result/:level
*/
router.get("/result/:level", protect, getAssessmentResult);

export default router;