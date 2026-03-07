import db from "../config/db.js";

/* ============================
   CREATE COURSE (ADMIN)
============================ */
export const createCourse = async (req, res) => {
  try {
    const { title, description, category_id } = req.body;

    if (!title || !category_id) {
      return res.status(400).json({ message: "Title and category required" });
    }

    await db.query(
      "INSERT INTO courses (title, description, category_id) VALUES (?, ?, ?)",
      [title, description || null, category_id]
    );

    res.status(201).json({ message: "Course created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   GET COURSES BY CATEGORY
============================ */
export const getCoursesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const [courses] = await db.query(
      "SELECT * FROM courses WHERE category_id = ? ORDER BY created_at DESC",
      [categoryId]
    );

    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



/* ============================
   LMS TREE (LEVEL → CATEGORY → COURSE → MODULE)
============================ */
export const getCourseTree = async (req, res) => {
  try {

    const [levels] = await db.query("SELECT * FROM levels ORDER BY id");

    const tree = [];

    for (const level of levels) {

      const [categories] = await db.query(
        "SELECT * FROM categories WHERE level_id = ?",
        [level.id]
      );

      const categoryData = [];

      for (const category of categories) {

        const [courses] = await db.query(
          "SELECT * FROM courses WHERE category_id = ?",
          [category.id]
        );

        const courseData = [];

        for (const course of courses) {

          const [modules] = await db.query(
            "SELECT * FROM modules WHERE course_id = ? ORDER BY lecture_order",
            [course.id]
          );

          courseData.push({
            ...course,
            modules
          });

        }

        categoryData.push({
          ...category,
          courses: courseData
        });

      }

      tree.push({
        ...level,
        categories: categoryData
      });

    }

    res.json(tree);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};




/* ============================
   USER LMS COURSES (FILTERED)
============================ */
export const getMyCourses = async (req, res) => {

  try {

    const userId = req.user.id;

    /* ===============================
       GET USER INFO
    =============================== */

    const [[user]] = await db.query(
      `SELECT business_category, designation_id
       FROM users
       WHERE id = ?`,
      [userId]
    );

    const userCategory = user.business_category;
    const userDesignation = user.designation_id;

    /* ===============================
       GET LEVELS
    =============================== */

    const [levels] = await db.query(
      "SELECT * FROM levels ORDER BY id"
    );

    const tree = [];

    for (const level of levels) {

      let categories;

      /* ===============================
         LEVEL 1 → FOR EVERYONE
      =============================== */

      if (level.id === 1) {

        [categories] = await db.query(
          `SELECT * FROM categories
           WHERE level_id = 1`
        );

      }

      /* ===============================
         LEVEL 2 → ONLY EMPLOYEES
      =============================== */

      else if (level.id === 2) {

        if (userCategory !== "Employees") {

          categories = [];

        } else {

          [categories] = await db.query(
            `SELECT * FROM categories
             WHERE level_id = 2
             AND designation_id = ?`,
            [userDesignation]
          );

        }

      }

      const categoryData = [];

      for (const category of categories) {

        const [courses] = await db.query(
          `SELECT * FROM courses
           WHERE category_id = ?`,
          [category.id]
        );

        const courseData = [];

        for (const course of courses) {

          const [modules] = await db.query(
            `SELECT * FROM modules
             WHERE course_id = ?
             ORDER BY lecture_order`,
            [course.id]
          );

          courseData.push({
            ...course,
            modules
          });

        }

        categoryData.push({
          ...category,
          courses: courseData
        });

      }

      tree.push({
        ...level,
        categories: categoryData
      });

    }

    res.json(tree);

  }

  catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};