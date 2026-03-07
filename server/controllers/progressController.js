import db from "../config/db.js";

/*
---------------------------------------------------
COMPLETE MODULE
---------------------------------------------------
POST /api/progress/complete-module
*/
export const completeModule = async (req, res) => {
  try {
    const userId = req.user.id;
    const { course_id, module_id } = req.body;

    if (!course_id || !module_id) {
      return res.status(400).json({
        message: "course_id and module_id are required",
      });
    }

    // check if module already completed
    const [existing] = await db.query(
      `SELECT * FROM user_progress 
       WHERE user_id = ? AND module_id = ?`,
      [userId, module_id]
    );

    if (existing.length > 0) {
      return res.json({
        message: "Module already completed",
      });
    }

    // insert completion
    await db.query(
      `INSERT INTO user_progress 
       (user_id, course_id, module_id, completed, completed_at)
       VALUES (?, ?, ?, true, NOW())`,
      [userId, course_id, module_id]
    );

    res.json({
      message: "Module marked as completed",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

/*
---------------------------------------------------
GET COURSE PROGRESS
---------------------------------------------------
GET /api/progress/course/:courseId
*/
export const getCourseProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    const [rows] = await db.query(
      `SELECT module_id, completed 
       FROM user_progress
       WHERE user_id = ? AND course_id = ?`,
      [userId, courseId]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

/*
---------------------------------------------------
GET NEXT MODULE (Sequential Learning)
---------------------------------------------------
GET /api/progress/next-module/:courseId
*/
export const getNextModule  = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    // get modules in order
    const [modules] = await db.query(
      `SELECT id 
       FROM modules 
       WHERE course_id = ?
       ORDER BY id ASC`,
      [courseId]
    );

    const [completed] = await db.query(
      `SELECT module_id 
       FROM user_progress 
       WHERE user_id = ? AND course_id = ? AND completed = true`,
      [userId, courseId]
    );

    const completedIds = completed.map((m) => m.module_id);

    let nextModule = null;

    for (const module of modules) {
      if (!completedIds.includes(module.id)) {
        nextModule = module.id;
        break;
      }
    }

    res.json({
      next_module: nextModule,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};