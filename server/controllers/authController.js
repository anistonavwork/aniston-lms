import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const registerUser = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      business_category,
      designation_id,
      custom_role
    } = req.body;

    if (!name || !email || !password || !business_category) {
      return res.status(400).json({
        message: "All required fields must be filled"
      });
    }

    // designation required only for employees
    if (business_category === "Employees" && !designation_id) {
      return res.status(400).json({
        message: "Designation is required for employees"
      });
    }

    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.query(
      `INSERT INTO users
      (name, email, password, system_role, business_category, designation_id, custom_role, is_approved)
      VALUES (?, ?, ?, 'user', ?, ?, ?, false)`,
      [
        name,
        email,
        hashedPassword,
        business_category,
        designation_id || null,
        custom_role || null
      ]
    );

    res.status(201).json({
      message: "Registration successful. Waiting for admin approval."
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
};









// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.is_approved) {
      return res.status(403).json({
        message: "Your account is not approved by admin yet",
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.system_role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.system_role,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


