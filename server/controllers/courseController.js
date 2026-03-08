import db from "../config/db.js";

/* ============================
   CREATE COURSE (ADMIN)
============================ */
export const createCourse = async (req, res) => {
  try {

    const { title, description, category_id } = req.body;

    if (!title || !category_id) {
      return res.status(400).json({
        message: "Title and category required"
      });
    }

    await db.query(
      "INSERT INTO courses (title, description, category_id) VALUES (?, ?, ?)",
      [title, description || null, category_id]
    );

    res.status(201).json({
      message: "Course created successfully"
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

    const [levels] = await db.query(
      "SELECT * FROM levels ORDER BY id"
    );

    const [categories] = await db.query(
      "SELECT * FROM categories"
    );

    const [courses] = await db.query(
      "SELECT * FROM courses"
    );

    const [modules] = await db.query(
      "SELECT * FROM modules ORDER BY lecture_order"
    );

    /* ============================
       GET USER DESIGNATION
    ============================ */

    const userId = req.user?.id;

    let userDesignation = null;

    if (userId) {

      const [[user]] = await db.query(
        "SELECT designation_id FROM users WHERE id = ?",
        [userId]
      );

      userDesignation = user?.designation_id || null;

    }

    /* ============================
       BUILD TREE
    ============================ */

    const tree = levels.map(level => {

      const levelCategories = categories
        .filter(cat => {

          if (cat.level_id !== level.id) return false;

          /* LEVEL 1 → EVERYONE */
          if (level.id === 1) return true;

          /* LEVEL 2 → DESIGNATION BASED */
          if (level.id === 2) {
            return cat.designation_id === userDesignation;
          }

          return false;

        })
        .map(category => {

          const categoryCourses = courses
            .filter(course => course.category_id === category.id)
            .map(course => {

              const courseModules = modules
                .filter(mod => mod.course_id === course.id);

              return {
                ...course,
                modules: courseModules
              };

            });

          return {
            ...category,
            courses: categoryCourses
          };

        });

      return {
        ...level,
        categories: levelCategories
      };

    });

    res.json(tree);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};



/* ============================
   USER LMS COURSES
============================ */

export const getMyCourses = async (req, res) => {
  return getCourseTree(req, res);
};





