import db from "../config/db.js";

/* ============================
   ADD MODULE (ADMIN)
============================ */
export const addModule = async (req, res) => {
  try {

    const {
      title,
      video_url,
      course_id,
      lecture_order,
      content_type,
      designation_id
    } = req.body;

    if (!title || !course_id || !lecture_order || !content_type) {
      return res.status(400).json({
        message: "title, course_id, lecture_order and content_type required"
      });
    }

    let filePath = null;

    // if file uploaded
    if (req.file) {
      filePath = req.file.path;
    }

    await db.query(
      `INSERT INTO modules 
      (title, content_type, video_url, file_path, course_id, lecture_order, designation_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        content_type,
        video_url || null,
        filePath,
        course_id,
        lecture_order,
        designation_id || null
      ]
    );

    res.status(201).json({
      message: "Module added successfully"
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
GET MODULES BY COURSE (FILTERED BY DESIGNATION)
GET /api/modules/:courseId
---------------------------------------
*/
export const getModulesByCourse = async (req, res) => {
  try {

    const { courseId } = req.params;
    const userId = req.user.id;

    // Get user's designation
    const [[user]] = await db.query(
      "SELECT designation_id FROM users WHERE id = ?",
      [userId]
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const designationId = user.designation_id;

    // Fetch modules for this course and designation
    const [modules] = await db.query(
      `SELECT *
       FROM modules
       WHERE course_id = ?
       AND (designation_id IS NULL OR designation_id = ?)
       ORDER BY lecture_order ASC`,
      [courseId, designationId]
    );

    res.json(modules);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error",
    });

  }
};


/* ============================
   UPDATE MODULE (ADMIN)
============================ */
export const updateModule = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      title,
      video_url,
      lecture_order,
      designation_id
    } = req.body;

    await db.query(
      `UPDATE modules
       SET title = ?, video_url = ?, lecture_order = ?, designation_id = ?
       WHERE id = ?`,
      [
        title,
        video_url || null,
        lecture_order,
        designation_id || null,
        id
      ]
    );

    res.json({
      message: "Module updated successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
};


/* ============================
   DELETE MODULE (ADMIN)
============================ */
export const deleteModule = async (req, res) => {
  try {

    const { id } = req.params;

    await db.query(
      "DELETE FROM modules WHERE id = ?",
      [id]
    );

    res.json({
      message: "Module deleted successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
};