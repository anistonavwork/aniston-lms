import db from "../config/db.js";

/* ============================
   CREATE COURSE (ADMIN)
============================ */
export const createCourse = async (req, res) => {
  try {

    const { title, description, level_id, designation_id } = req.body;

    if (!title || !level_id) {
      return res.status(400).json({
        message: "Title and level required"
      });
    }

    const [result] = await db.query(
      `INSERT INTO courses (title, description, level_id, designation_id)
       VALUES (?, ?, ?, ?)`,
      [
        title,
        description || null,
        level_id,
        designation_id || null
      ]
    );

    res.status(201).json({
      message: "Course created successfully",
      course_id: result.insertId
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
};


/* ============================
   GET COURSES BY CATEGORY
============================ */
export const getCoursesByCategory = async (req, res) => {

  try {

    const { categoryId } = req.params;

    const [courses] = await db.query(`
      SELECT 
        c.*,
        COUNT(m.id) AS module_count
      FROM courses c
      LEFT JOIN modules m 
        ON m.course_id = c.id
      WHERE c.category_id = ?
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `, [categoryId]);

    res.json(courses);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};


/* ============================
   LMS TREE (LEVEL → CATEGORY → COURSE → MODULE)
============================ */
export const getCourseTree = async (req, res) => {
  try {
    const userId = req.user.id;

    /* GET USER DESIGNATION */

    const [[user]] = await db.query(
      `SELECT designation_id FROM users WHERE id = ?`,
      [userId]
    );

    const designationId = user.designation_id;

    /* GET LEVELS */

    const [levels] = await db.query(
      `SELECT * FROM levels ORDER BY id`
    );

    const result = [];

    for (const level of levels) {

      /* GET CATEGORIES WITH DESIGNATION FILTER */

      const [categories] = await db.query(
        `SELECT *
         FROM categories
         WHERE level_id = ?
         AND (
           designation_id IS NULL
           OR designation_id = ?
         )`,
        [level.id, designationId]
      );

      for (const category of categories) {

        /* GET COURSES */

        const [courses] = await db.query(
          `SELECT *
           FROM courses
           WHERE category_id = ?`,
          [category.id]
        );

        for (const course of courses) {

          /* GET MODULES */

          const [modules] = await db.query(
            `SELECT *
             FROM modules
             WHERE course_id = ?
             ORDER BY lecture_order ASC`,
            [course.id]
          );

          course.modules = modules;
        }

        category.courses = courses;
      }

      level.categories = categories;

      result.push(level);
    }

    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};



/* ============================
   USER LMS COURSES
============================ */

export const getMyCourses = async (req, res) => {
  return getCourseTree(req, res);
};





