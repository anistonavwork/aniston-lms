import db from "../config/db.js";

/*
---------------------------------------
GET PENDING USERS
---------------------------------------
*/
export const getPendingUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, name, email, business_category FROM users WHERE is_approved = false"
    );

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/*
---------------------------------------
APPROVE USER
---------------------------------------
*/
export const approveUser = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "UPDATE users SET is_approved = true WHERE id = ?",
      [id]
    );

    res.json({ message: "User approved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/*
---------------------------------------
GET ALL USERS (ADMIN PANEL)
---------------------------------------
*/
export const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT id, name, email, business_category, system_role AS role 
       FROM users 
       WHERE is_approved = true`
    );

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/*
---------------------------------------
GET USER DETAILS
---------------------------------------
*/
export const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const [[user]] = await db.query(
      `SELECT id, name, email, business_category, system_role AS role
       FROM users
       WHERE id = ?`,
      [id]
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const [courses] = await db.query(
      `SELECT 
          c.id AS course_id,
          c.title,
          IFNULL(
            ROUND(
              (COUNT(up.module_id) /
              (SELECT COUNT(*) FROM modules WHERE course_id = c.id)) * 100
            ),
            0
          ) AS progress
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       LEFT JOIN user_progress up 
         ON up.course_id = c.id 
         AND up.user_id = e.user_id
       WHERE e.user_id = ?
       GROUP BY c.id`,
      [id]
    );

    res.json({
      user,
      courses
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/*
---------------------------------------
DELETE USER
---------------------------------------
*/
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM users WHERE id = ?", [id]);

    res.json({ message: "User deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};








/*
---------------------------------------
GET ALL ASSESSMENT RESULTS (ADMIN)
---------------------------------------
*/
export const getAssessmentResults = async (req, res) => {

  try {

    const [results] = await db.query(
      `SELECT 
          u.id AS user_id,
          u.name,
          u.email,
          ar.level,
          ar.score,
          ar.passed,
          ar.taken_at
       FROM assessment_results ar
       JOIN users u ON u.id = ar.user_id
       ORDER BY ar.taken_at DESC`
    );

    res.json(results);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};




export const getDesignations = async (req, res) => {

  try {

    const [rows] = await db.query(
      "SELECT * FROM designations ORDER BY name ASC"
    );

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};






export const getLevels = async (req, res) => {

  try {

    const [rows] = await db.query(
      "SELECT * FROM levels ORDER BY id"
    );

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};








/*
---------------------------------------
GET FULL LMS STRUCTURE (ADMIN)
---------------------------------------
GET /api/admin/lms-structure
*/
export const getLmsStructure = async (req, res) => {

  try {

    const [levels] = await db.query(
      "SELECT * FROM levels ORDER BY id ASC"
    );

    const structure = [];

    for (const level of levels) {

      const [categories] = await db.query(
        "SELECT * FROM categories WHERE level_id = ?",
        [level.id]
      );

      const categoryList = [];

      for (const category of categories) {

        const [courses] = await db.query(
          "SELECT * FROM courses WHERE category_id = ?",
          [category.id]
        );

        const courseList = [];

        for (const course of courses) {

          const [modules] = await db.query(
            `SELECT id, title, lecture_order
             FROM modules
             WHERE course_id = ?
             ORDER BY lecture_order ASC`,
            [course.id]
          );

          courseList.push({
            ...course,
            modules
          });

        }

        categoryList.push({
          ...category,
          courses: courseList
        });

      }

      structure.push({
        ...level,
        categories: categoryList
      });

    }

    res.json(structure);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};