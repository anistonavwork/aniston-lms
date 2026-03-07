import express from "express";

import {
  getPendingUsers,
  approveUser,
  getAllUsers,
  getUserDetails,
  deleteUser,
  getAssessmentResults,
  getDesignations,
  getLevels,
  getLmsStructure
} from "../controllers/adminController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/*
---------------------------------------
PENDING USERS
---------------------------------------
*/
router.get("/pending", protect, authorize("admin"), getPendingUsers);

router.put("/approve/:id", protect, authorize("admin"), approveUser);

/*
---------------------------------------
USER MANAGEMENT
---------------------------------------
*/
router.get("/users", protect, authorize("admin"), getAllUsers);

router.get("/users/:id", protect, authorize("admin"), getUserDetails);

router.delete("/users/:id", protect, authorize("admin"), deleteUser);


router.get("/levels", getLevels);
router.get("/designations", getDesignations);



/*
---------------------------------------
ASSESSMENT RESULTS (ADMIN)
---------------------------------------
GET /api/admin/assessments
*/
router.get(
  "/assessments",
  protect,
  authorize("admin"),
  getAssessmentResults
);

router.get(
  "/lms-structure",
  protect,
  authorize("admin"),
  getLmsStructure
);

export default router;