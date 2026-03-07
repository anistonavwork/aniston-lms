import express from "express";
import { getCmsContent, updateCmsSection } from "../controllers/cmsController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/*
--------------------------------
PUBLIC CMS CONTENT
GET /api/cms
--------------------------------
*/
router.get("/", getCmsContent);

/*
--------------------------------
ADMIN UPDATE CMS
PUT /api/cms/:section
--------------------------------
*/
router.put("/:section", protect, authorize("admin"), updateCmsSection);

export default router;