import db from "../config/db.js";
import bcrypt from "bcryptjs";

export const createAdminIfNotExists = async () => {
  try {
    const [admins] = await db.query(
      "SELECT * FROM users WHERE system_role = 'admin'"
    );

    if (admins.length > 0) {
      console.log("Admin already exists ✅");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );

    await db.query(
      `INSERT INTO users 
      (name, email, password, system_role, business_category, is_approved)
      VALUES (?, ?, ?, 'admin', 'Internal', true)`,
      [
        process.env.ADMIN_NAME,
        process.env.ADMIN_EMAIL,
        hashedPassword,
      ]
    );

    console.log("Default Admin Created ✅");
  } catch (error) {
    console.error("Admin seeding failed ❌", error);
  }
};