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
       GET LATEST PASSED ASSESSMENT
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
        message: "Minimum 80% required to generate certificate",
      });
    }

    const score = assessment[0].score;

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
       CERTIFICATE PATH
    =============================== */

    const certDir = "certificates";

    if (!fs.existsSync(certDir)) {
      fs.mkdirSync(certDir);
    }

    const fileName = `certificate-${userId}-${Date.now()}.pdf`;
    const filePath = path.join(certDir, fileName);

    /* ===============================
       ASSETS PATH
    =============================== */

    const logoPath = path.join("assets", "logo.png");
    const signaturePath = path.join("assets", "signature.png");
    const watermarkPath = path.join("assets", "watermark.png");

    /* ===============================
       CREATE PDF
    =============================== */

    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
    });

    doc.pipe(fs.createWriteStream(filePath));

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    /* ===============================
       BACKGROUND WATERMARK
    =============================== */

    if (fs.existsSync(watermarkPath)) {
      doc.opacity(0.08);
      doc.image(watermarkPath, pageWidth / 2 - 200, pageHeight / 2 - 200, {
        width: 400,
      });
      doc.opacity(1);
    }

    /* ===============================
       BORDER
    =============================== */

    doc.rect(20, 20, pageWidth - 40, pageHeight - 40)
      .lineWidth(3)
      .stroke("#000");

    /* ===============================
       LOGO
    =============================== */

    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, pageWidth / 2 - 60, 40, { width: 120 });
    }

    doc.moveDown(4);

    /* ===============================
       TITLE
    =============================== */

    doc
      .fontSize(36)
      .fillColor("#000")
      .text("ANISTON TECHNOLOGIES", {
        align: "center",
      });

    doc.moveDown();

    doc
      .fontSize(26)
      .fillColor("#B8860B")
      .text("Certificate of Completion", {
        align: "center",
      });

    doc.moveDown(2);

    /* ===============================
       USER NAME
    =============================== */

    doc
      .fontSize(18)
      .fillColor("#000")
      .text("This certifies that", { align: "center" });

    doc.moveDown();

    doc
      .fontSize(34)
      .fillColor("#000")
      .text(user.name.toUpperCase(), {
        align: "center",
      });

    doc.moveDown();

    doc
      .fontSize(20)
      .text("has successfully completed the", {
        align: "center",
      });

    doc.moveDown();

    doc
      .fontSize(24)
      .fillColor("#B8860B")
      .text("Level 2 Training Program", {
        align: "center",
      });

    doc.moveDown(2);

    /* ===============================
       SCORE
    =============================== */

    doc
      .fontSize(18)
      .fillColor("#000")
      .text(`Score Achieved: ${score}%`, {
        align: "center",
      });

    doc.moveDown(3);

    /* ===============================
       SIGNATURE
    =============================== */

    if (fs.existsSync(signaturePath)) {
      doc.image(signaturePath, pageWidth / 2 - 60, pageHeight - 150, {
        width: 120,
      });
    }

    doc
      .fontSize(14)
      .text("Authorized Signature", pageWidth / 2 - 80, pageHeight - 60);

    /* ===============================
       CERTIFICATE ID
    =============================== */

    const certId = `CERT-${userId}-${Date.now()}`;

    doc
      .fontSize(12)
      .text(`Certificate ID: ${certId}`, 50, pageHeight - 50);

    doc
      .fontSize(12)
      .text(
        `Issued On: ${new Date().toDateString()}`,
        pageWidth - 200,
        pageHeight - 50
      );

    doc.end();

    const certUrl = `/certificates/${fileName}`;

    /* ===============================
       SAVE TO DATABASE
    =============================== */

    const [result] = await db.query(
      `INSERT INTO certificates (user_id, level, certificate_url)
       VALUES (?, ?, ?)`,
      [userId, 2, certUrl]
    );

    res.json({
      id: result.insertId,
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
      [userId],
    );

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
