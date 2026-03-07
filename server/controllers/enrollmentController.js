import db from "../config/db.js";

/*
---------------------------------------
ENROLL USER IN COURSE
---------------------------------------
POST /api/enrollments/enroll
*/
export const enrollCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const { course_id } = req.body;

    if (!course_id) {
      return res.status(400).json({
        message: "course_id is required",
      });
    }

    // check if already enrolled
    const [existing] = await db.query(
      "SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?",
      [userId, course_id]
    );

    if (existing.length > 0) {
      return res.json({
        message: "Already enrolled",
      });
    }

    await db.query(
      "INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)",
      [userId, course_id]
    );

    res.json({
      message: "Enrollment successful",
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
GET USER ENROLLED COURSES
---------------------------------------
GET /api/enrollments/my-courses
*/
export const getMyCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const [courses] = await db.query(
      `SELECT courses.*
       FROM enrollments
       JOIN courses ON courses.id = enrollments.course_id
       WHERE enrollments.user_id = ?`,
      [userId]
    );

    res.json(courses);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};