import db from "../config/db.js";

/*
---------------------------------------
SUBMIT ASSESSMENT
---------------------------------------
POST /api/assessment/submit
*/
export const submitAssessment = async (req, res) => {
  try {

    const userId = req.user.id;
    const { level_id, score } = req.body;

    /* ==============================
       CHECK LEVEL 2 TRAINING COMPLETION
    ============================== */

    const [completedCourses] = await db.query(
      `SELECT *
       FROM course_completions cc
       JOIN courses c ON cc.course_id = c.id
       WHERE cc.user_id = ?
       AND c.level_id = 2`,
      [userId]
    );

    if (completedCourses.length === 0) {
      return res.status(403).json({
        message:
          "Please complete your Level 2 training before taking the assessment",
      });
    }

    /* VALIDATE INPUT */

    if (!level_id || score === undefined) {
      return res.status(400).json({
        message: "level_id and score are required",
      });
    }

    if (score < 0 || score > 100) {
      return res.status(400).json({
        message: "Invalid score value",
      });
    }

    /* PREVENT SPAM */

    const [recent] = await db.query(
      `SELECT *
       FROM assessment_results
       WHERE user_id = ?
       AND level_id = ?
       AND taken_at > NOW() - INTERVAL 30 SECOND`,
      [userId, level_id]
    );

    if (recent.length > 0) {
      return res.status(429).json({
        message: "Please wait before submitting again",
      });
    }

    const passed = score >= 80;

    await db.query(
      `INSERT INTO assessment_results
       (user_id, level_id, score, passed)
       VALUES (?, ?, ?, ?)`,
      [userId, level_id, score, passed]
    );

    res.json({
      message: "Assessment submitted",
      passed,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error",
    });

  }
};


/*
---------------------------------------
GET USER ASSESSMENT RESULT
---------------------------------------
GET /api/assessment/result/:level
*/
export const getAssessmentResult = async (req, res) => {

  try {

    const userId = req.user.id;
    const { level } = req.params;

    const [result] = await db.query(
      `SELECT *
       FROM assessment_results
       WHERE user_id = ?
       AND level_id = ?
       ORDER BY taken_at DESC
       LIMIT 1`,
      [userId, level]
    );

    res.json(result[0] || null);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error",
    });

  }

};