import express from "express";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/demo", protect, (req, res) => {
  res.json([
    {
      id: 1,
      title: "Introduction to AV Systems",
      video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      id: 2,
      title: "AI in Audio Processing",
      video: "https://www.youtube.com/watch?v=ysz5S6PUM-U"
    }
  ]);
});

export default router;