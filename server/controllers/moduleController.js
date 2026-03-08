import db from "../config/db.js";

/* ============================
   ADD MODULE (ADMIN)
============================ */
export const addModule = async (req, res) => {
  try {

    const {
      title,
      step_name,
      video_url,
      course_id,
      content_type
    } = req.body;

    if (!title || !course_id || !content_type) {
      return res.status(400).json({
        message: "title, course_id and content_type required"
      });
    }

    /* ======================
       FILE PATH
    ====================== */

    let filePath = null;

    if (req.file) {
      filePath = req.file.path;
    }

    /* ======================
       AUTO STEP NAME
    ====================== */

    let stepName = step_name;

    if (!stepName) {
      stepName = "Step 1";
    }

    /* ======================
       AUTO LECTURE ORDER
    ====================== */

    const [[orderResult]] = await db.query(
      `SELECT COUNT(*) as count
       FROM modules
       WHERE course_id = ?
       AND step_name = ?`,
      [course_id, stepName]
    );

    const lectureOrder = orderResult.count + 1;

    /* ======================
       INSERT MODULE
    ====================== */

    await db.query(
      `INSERT INTO modules
      (title, step_name, content_type, video_url, file_path, course_id, lecture_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        stepName,
        content_type,
        video_url || null,
        filePath,
        course_id,
        lectureOrder
      ]
    );

    res.status(201).json({
      message: "Lecture uploaded successfully"
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
GET MODULES BY COURSE
GET /api/modules/:courseId
---------------------------------------
*/
export const getModulesByCourse = async (req, res) => {

  try {

    const { courseId } = req.params;

    const [modules] = await db.query(
      `SELECT *
       FROM modules
       WHERE course_id = ?
       ORDER BY lecture_order ASC`,
      [courseId]
    );

    const grouped = {};

    for (const module of modules) {

      if (!grouped[module.step_name]) {
        grouped[module.step_name] = [];
      }

      grouped[module.step_name].push(module);

    }

    res.json(grouped);

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
      step_name,
      video_url,
      lecture_order
    } = req.body;

    await db.query(
      `UPDATE modules
       SET title = ?, step_name = ?, video_url = ?, lecture_order = ?
       WHERE id = ?`,
      [
        title,
        step_name,
        video_url || null,
        lecture_order,
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