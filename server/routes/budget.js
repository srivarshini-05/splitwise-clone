const express = require("express");
const router = express.Router();
const db = require("../db");

/* =========================================
   ADD OR UPDATE BUDGET
========================================= */

router.post("/set", (req, res) => {
  const { user_id, category, monthly_limit } = req.body;

  if (!user_id || !category || !monthly_limit) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const checkQuery = `
    SELECT id FROM budgets 
    WHERE user_id = ? AND category = ?
  `;

  db.query(checkQuery, [user_id, category], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length > 0) {
      const updateQuery = `
        UPDATE budgets 
        SET monthly_limit = ? 
        WHERE user_id = ? AND category = ?
      `;

      db.query(updateQuery, [monthly_limit, user_id, category], (err2) => {
        if (err2) return res.status(500).json(err2);
        res.json({ message: "Budget updated" });
      });
    } else {
      const insertQuery = `
        INSERT INTO budgets (user_id, category, monthly_limit)
        VALUES (?, ?, ?)
      `;

      db.query(insertQuery, [user_id, category, monthly_limit], (err2) => {
        if (err2) return res.status(500).json(err2);
        res.json({ message: "Budget created" });
      });
    }
  });
});

/* =========================================
   GET BUDGET STATUS (CURRENT MONTH)
========================================= */

router.get("/:userId", (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT 
      b.category,
      b.monthly_limit,
      IFNULL(SUM(pe.amount),0) AS spent
    FROM budgets b
    LEFT JOIN personal_expenses pe
      ON pe.user_id = b.user_id
      AND pe.category = b.category
      AND MONTH(pe.date) = MONTH(CURDATE())
      AND YEAR(pe.date) = YEAR(CURDATE())
    WHERE b.user_id = ?
    GROUP BY b.category, b.monthly_limit
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json(err);

    const formatted = results.map((row) => {
      const spent = parseFloat(row.spent);
      const limit = parseFloat(row.monthly_limit);
      const remaining = limit - spent;
      const usage = ((spent / limit) * 100).toFixed(0);

      return {
        category: row.category,
        limit,
        spent,
        remaining,
        usage: parseInt(usage),
      };
    });

    res.json(formatted);
  });
});

module.exports = router;