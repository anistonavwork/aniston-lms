import express from "express";
import { createCategory, deleteCategory, getCategories, updateCourse } from "../controllers/categoryController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Admin only
router.post("/", protect, authorize("admin"), createCategory);
// Public (or protected if you want)
router.get("/",  getCategories);


router.delete("/:id", protect, authorize("admin"), deleteCategory);

router.put("/:id", protect, authorize("admin"), updateCourse);

export default router;