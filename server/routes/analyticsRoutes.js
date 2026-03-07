import express from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/*
---------------------------------------
ADMIN ANALYTICS
---------------------------------------
GET /api/admin/analytics
*/
router.get(
  "/analytics",
  protect,
  authorize("admin"),
  getAnalytics
);

export default router;