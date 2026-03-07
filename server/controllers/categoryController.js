import db from "../config/db.js";

/* ============================
   CREATE CATEGORY (ADMIN)
============================ */
export const createCategory = async (req, res) => {

  try {

    const { name, level_id, designation_id } = req.body;

    if (!name || !level_id) {
      return res.status(400).json({
        message: "Category name and level are required"
      });
    }

    // level 2 requires designation
    if (parseInt(level_id) === 2 && !designation_id) {
      return res.status(400).json({
        message: "Designation required for Level 2 category"
      });
    }

    await db.query(
      `INSERT INTO categories
      (name, level_id, designation_id)
      VALUES (?, ?, ?)`,
      [
        name,
        level_id,
        level_id === 2 ? designation_id : null
      ]
    );

    res.status(201).json({
      message: "Category created successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};

/* ============================
   GET ALL CATEGORIES
============================ */
export const getCategories = async (req, res) => {
  try {
    const [categories] = await db.query(
      "SELECT * FROM categories ORDER BY created_at DESC"
    );

    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "DELETE FROM categories WHERE id = ?",
      [id]
    );

    res.json({ message: "Category deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category_id } = req.body;

    await db.query(
      `UPDATE courses 
       SET title = ?, description = ?, category_id = ?
       WHERE id = ?`,
      [title, description, category_id, id]
    );

    res.json({ message: "Course updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};