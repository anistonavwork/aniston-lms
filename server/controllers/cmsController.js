import db from "../config/db.js";

/*
---------------------------------------
GET CMS CONTENT
---------------------------------------
GET /api/cms
*/
export const getCmsContent = async (req, res) => {
  try {

    const [rows] = await db.query(
      "SELECT * FROM cms_content ORDER BY id ASC"
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
UPDATE CMS SECTION (ADMIN)
---------------------------------------
PUT /api/cms/:section
*/
export const updateCmsSection = async (req, res) => {

  try {

    const { section } = req.params;
    const { title, description } = req.body;

    await db.query(
      `UPDATE cms_content 
       SET title = ?, description = ?
       WHERE section_name = ?`,
      [title, description, section]
    );

    res.json({
      message: "CMS section updated"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};