import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import lectureRoutes from "./routes/lectureRoutes.js";

import categoryRoutes from "./routes/categoryRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";


import progressRoutes from "./routes/progressRoutes.js";

import certificateRoutes from "./routes/certificateRoutes.js";

import enrollmentRoutes from "./routes/enrollmentRoutes.js";

import assessmentRoutes from "./routes/assessmentRoutes.js";

import analyticsRoutes from "./routes/analyticsRoutes.js";

import cmsRoutes from "./routes/cmsRoutes.js";

import { createAdminIfNotExists } from "./utils/createAdmin.js";

dotenv.config();

const app = express();



app.use(cors());
app.use(express.json());


app.use("/certificates", express.static("certificates"));
app.use("/uploads", express.static("uploads"));


app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", analyticsRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/cms", cmsRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/assessment", assessmentRoutes);



app.use("/api/lectures", lectureRoutes);









// Test route
app.get("/", (req, res) => {
  res.json({ message: "API Running ✅" });
});

const PORT = process.env.PORT || 5000;

// 🔥 Check DB before starting server
const startServer = async () => {
  try {
    await db.query("SELECT 1");
console.log("Database Connected ✅");
await createAdminIfNotExists();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Database connection failed ❌");
    console.error(error);
  }
};

startServer();