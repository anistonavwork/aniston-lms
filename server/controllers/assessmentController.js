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

    if (!level || score === undefined) {
      return res.status(400).json({
        message: "level and score are required"
      });
    }

    const passed = score >= 80;

    await db.query(
      `INSERT INTO assessment_results 
      (user_id, level, score, passed)
      VALUES (?, ?, ?, ?)`,
      [userId, level, score, passed]
    );

    res.json({
      message: "Assessment submitted",
      passed
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
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
      [userId, level]
    );

    res.json(result[0] || null);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};