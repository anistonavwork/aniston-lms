import db from "../config/db.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateCertificate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { level } = req.body;

    if (level !== 2) {
      return res.status(400).json({
        message: "Certificate is only available after Level 2 assessment",
      });
    }

    /* ===============================
       CHECK LATEST LEVEL 2 ASSESSMENT
    =============================== */

    const [assessment] = await db.query(
      `SELECT * FROM assessment_results
       WHERE user_id = ? AND level = 2
       ORDER BY taken_at DESC
       LIMIT 1`,
      [userId]
    );

    if (assessment.length === 0) {
      return res.status(400).json({
        message: "Level 2 assessment not completed",
      });
    }

    if (!assessment[0].passed) {
      return res.status(400).json({
        message: "You must score 80% or above in Level 2 assessment",
      });
    }

    /* ===============================
       CHECK EXISTING CERTIFICATE
    =============================== */

    const [existing] = await db.query(
      `SELECT * FROM certificates
       WHERE user_id = ? AND level = 2`,
      [userId]
    );

    if (existing.length > 0) {
      return res.json(existing[0]);
    }

    /* ===============================
       GET USER INFO
    =============================== */

    const [[user]] = await db.query(
      `SELECT name FROM users WHERE id = ?`,
      [userId]
    );

    /* ===============================
       CREATE CERTIFICATE DIRECTORY
    =============================== */

    const certDir = "certificates";

    if (!fs.existsSync(certDir)) {
      fs.mkdirSync(certDir);
    }

    const fileName = `certificate-user-${userId}.pdf`;
    const filePath = path.join(certDir, fileName);

    /* ===============================
       GENERATE PDF CERTIFICATE
    =============================== */

    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
    });

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(40).text("Certificate of Completion", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(22).text("This certifies that", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(36).text(user.name, {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(20).text(
      "has successfully completed the Level 2 Training Program",
      { align: "center" }
    );

    doc.moveDown();

    doc.fontSize(16).text(
      `Date: ${new Date().toDateString()}`,
      { align: "center" }
    );

    doc.end();

    const certUrl = `/certificates/${fileName}`;

    /* ===============================
       STORE CERTIFICATE IN DATABASE
    =============================== */

    const [result] = await db.query(
      `INSERT INTO certificates (user_id, level, certificate_url)
       VALUES (?, ?, ?)`,
      [userId, 2, certUrl]
    );

    res.json({
      id: result.insertId,
      level: 2,
      certificate_url: certUrl,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

/*
---------------------------------------------------
GET USER CERTIFICATES
---------------------------------------------------
GET /api/certificates/my-certificates
*/
export const getUserCertificates = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      `SELECT * FROM certificates
       WHERE user_id = ?
       ORDER BY issued_at DESC`,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};