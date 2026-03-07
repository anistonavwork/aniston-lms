import db from "../config/db.js";

/*
---------------------------------------
ADMIN DASHBOARD ANALYTICS
---------------------------------------
GET /api/admin/analytics
*/
export const getAnalytics = async (req, res) => {
  try {

    /* =============================
       TOTAL COUNTS
    ============================= */

    const [[users]] = await db.query(
      "SELECT COUNT(*) as total_users FROM users"
    );

    const [[courses]] = await db.query(
      "SELECT COUNT(*) as total_courses FROM courses"
    );

    const [[modules]] = await db.query(
      "SELECT COUNT(*) as total_modules FROM modules"
    );

    const [[enrollments]] = await db.query(
      "SELECT COUNT(*) as total_enrollments FROM enrollments"
    );

    const [[passedAssessments]] = await db.query(
      "SELECT COUNT(*) as passed_assessments FROM assessment_results WHERE passed = true"
    );

    const [[certificates]] = await db.query(
      "SELECT COUNT(*) as certificates_issued FROM certificates"
    );

    /* =============================
       USER GROWTH (LAST 7 DAYS)
    ============================= */

    const [userGrowth] = await db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as users
      FROM users
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 7
    `);

    /* =============================
       ENROLLMENTS PER COURSE
    ============================= */

    const [courseEnrollments] = await db.query(`
      SELECT 
        c.title,
        COUNT(e.id) as enrollments
      FROM courses c
      LEFT JOIN enrollments e 
        ON e.course_id = c.id
      GROUP BY c.id
      ORDER BY enrollments DESC
      LIMIT 5
    `);

    /* =============================
       COURSE COMPLETION
    ============================= */

    const [courseCompletion] = await db.query(`
      SELECT 
        c.title,
        COUNT(DISTINCT up.user_id) as completed_users
      FROM courses c
      LEFT JOIN user_progress up 
        ON up.course_id = c.id
      GROUP BY c.id
      ORDER BY completed_users DESC
      LIMIT 5
    `);

    /* =============================
       FINAL RESPONSE
    ============================= */

    res.json({
      totals: {
        total_users: users.total_users,
        total_courses: courses.total_courses,
        total_modules: modules.total_modules,
        total_enrollments: enrollments.total_enrollments,
        passed_assessments: passedAssessments.passed_assessments,
        certificates_issued: certificates.certificates_issued
      },

      user_growth: userGrowth,
      course_enrollments: courseEnrollments,
      course_completion: courseCompletion
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
};