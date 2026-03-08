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

    /* =========================
       CHECK IF MODULE ALREADY COMPLETED
    ========================= */

    const [existing] = await db.query(
      `SELECT * FROM user_progress 
       WHERE user_id = ? AND module_id = ?`,
      [userId, module_id],
    );

    if (existing.length > 0) {
      return res.json({
        message: "Module already completed",
      });
    }

    /* =========================
       INSERT MODULE COMPLETION
    ========================= */

    await db.query(
      `INSERT INTO user_progress 
       (user_id, course_id, module_id, completed, completed_at)
       VALUES (?, ?, ?, true, NOW())`,
      [userId, course_id, module_id],
    );

    /* =========================
       CHECK COURSE COMPLETION
    ========================= */

    const [[module]] = await db.query(
      `SELECT course_id FROM modules WHERE id = ?`,
      [module_id],
    );

    const courseId = module.course_id;

    /* TOTAL MODULES IN COURSE */

    const [[totalModules]] = await db.query(
      `SELECT COUNT(*) as total 
       FROM modules 
       WHERE course_id = ?`,
      [courseId],
    );

    /* COMPLETED MODULES */

    const [[completedModules]] = await db.query(
      `SELECT COUNT(*) as completed
       FROM user_progress up
       JOIN modules m ON up.module_id = m.id
       WHERE up.user_id = ? 
       AND m.course_id = ? 
       AND up.completed = true`,
      [userId, courseId],
    );

    /* =========================
       IF ALL MODULES COMPLETED
    ========================= */

    if (completedModules.completed === totalModules.total) {
      await db.query(
        `INSERT IGNORE INTO course_completions (user_id, course_id)
         VALUES (?, ?)`,
        [userId, courseId],
      );
    }

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
      `SELECT 
        m.id AS module_id,
        IF(up.completed IS NULL, false, up.completed) AS completed
       FROM modules m
       LEFT JOIN user_progress up 
         ON up.module_id = m.id 
         AND up.user_id = ?
       WHERE m.course_id = ?
       ORDER BY m.lecture_order ASC`,
      [userId, courseId],
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
export const getNextModule = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    /* GET MODULES ORDER */

    const [modules] = await db.query(
      `SELECT id
       FROM modules
       WHERE course_id = ?
       ORDER BY lecture_order ASC`,
      [courseId],
    );

    /* COMPLETED MODULES */

    const [completed] = await db.query(
      `SELECT module_id
       FROM user_progress
       WHERE user_id = ?
       AND course_id = ?
       AND completed = true`,
      [userId, courseId],
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