import express from "express";
import { addModule, deleteModule, getModulesByCourse, updateModule } from "../controllers/moduleController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";


const router = express.Router(); 

// Admin only
router.post("/", protect, authorize("admin"), upload.single("file"), addModule );

// User/Admin
router.get("/:courseId", protect, getModulesByCourse);
router.put("/:id", protect, authorize("admin"), updateModule);

router.delete("/:id", protect, authorize("admin"), deleteModule);

export default router; 