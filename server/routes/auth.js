const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");

/* =====================================================
   REGISTER USER
===================================================== */

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    db.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
      async (err, users) => {
        if (err) return res.status(500).json(err);

        if (users.length > 0) {
          return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
          "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
          [name, email, hashedPassword],
          (err, result) => {
            if (err) return res.status(500).json(err);

            res.json({
              message: "User registered successfully",
              user: {
                id: result.insertId,
                name,
                email,
              },
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
});

/* =====================================================
   LOGIN USER
===================================================== */

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, users) => {
      if (err) return res.status(500).json(err);

      if (users.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      const user = users[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    }
  );
});

module.exports = router;