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
    const { level, score } = req.body;

    /* ==============================
   CHECK TRAINING COMPLETION
============================== */

const [[trainingCourse]] = await db.query(
  "SELECT id FROM courses WHERE title = 'HR Training' LIMIT 1"
);

const trainingCourseId = trainingCourse?.id;

if (!trainingCourseId) {
  return res.status(500).json({
    message: "Training course not configured",
  });
}

const [[totalModules]] = await db.query(
  "SELECT COUNT(*) as total FROM modules WHERE course_id = ?",
  [trainingCourseId]
);

const [[completedModules]] = await db.query(
  `SELECT COUNT(*) as completed
   FROM user_progress
   WHERE user_id = ? AND course_id = ? AND completed = true`,
  [userId, trainingCourseId]
);

if (completedModules.completed < totalModules.total) {
  return res.status(403).json({
    message: "Please complete HR training before taking the assessment",
  });
}

    /* VALIDATE INPUT */

    if (!level || score === undefined) {
      return res.status(400).json({
        message: "level and score are required",
      });
    }

    if (score < 0 || score > 100) {
      return res.status(400).json({
        message: "Invalid score value",
      });
    }

    /* PREVENT SPAM */

const [recent] = await db.query(
  `SELECT * FROM assessment_results
   WHERE user_id = ? AND level = ?
   AND taken_at > NOW() - INTERVAL 30 SECOND`,
  [userId, level]
);

if (recent.length > 0) {
  return res.status(429).json({
    message: "Please wait before submitting again"
  });
}


    const passed = score >= 80;

    await db.query(
      `INSERT INTO assessment_results 
      (user_id, level, score, passed)
      VALUES (?, ?, ?, ?)`,
      [userId, level, score, passed],
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
      `SELECT * FROM assessment_results
       WHERE user_id = ? AND level = ?
       ORDER BY taken_at DESC
       LIMIT 1`,
      [userId, level],
    );

    res.json(result[0] || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
