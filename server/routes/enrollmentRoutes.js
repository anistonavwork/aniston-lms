import express from "express";
import {
  enrollCourse
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



export default router;