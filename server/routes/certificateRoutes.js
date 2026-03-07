import express from "express";
import {
  generateCertificate,
  getUserCertificates
} from "../controllers/certificateController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/*
---------------------------------------
GENERATE CERTIFICATE
---------------------------------------
POST /api/certificates/generate
*/
router.post("/generate", protect, generateCertificate);


/*
---------------------------------------
GET USER CERTIFICATES
---------------------------------------
GET /api/certificates/my-certificates
*/
router.get("/my-certificates", protect, getUserCertificates);

export default router;