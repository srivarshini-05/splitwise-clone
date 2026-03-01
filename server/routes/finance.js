const express = require("express");
const router = express.Router();
const db = require("../db");

/* =====================================================
   1️⃣ ADD INCOME
===================================================== */

router.post("/income", (req, res) => {
  const { user_id, amount, source, date } = req.body;

  if (!user_id || !amount) {
    return res.status(400).json({ message: "User ID and amount required" });
  }

  const formattedDate = date
    ? new Date(date).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const query = `
    INSERT INTO incomes (user_id, amount, source, date)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    query,
    [user_id, amount, source || "Income", formattedDate],
    (err, result) => {
      if (err) {
        console.error("Income Insert Error:", err);
        return res.status(500).json(err);
      }

      res.json({
        message: "Income added successfully",
        income_id: result.insertId,
      });
    }
  );
});

/* =====================================================
   2️⃣ ADD PERSONAL EXPENSE
===================================================== */

router.post("/personal-expense", (req, res) => {
  const { user_id, amount, title, date } = req.body;

  if (!user_id || !amount) {
    return res.status(400).json({ message: "User ID and amount required" });
  }

  const formattedDate = date
    ? new Date(date).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const query = `
    INSERT INTO personal_expenses (user_id, amount, title, date)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    query,
    [user_id, amount, title || "Expense", formattedDate],
    (err, result) => {
      if (err) {
        console.error("Expense Insert Error:", err);
        return res.status(500).json(err);
      }

      res.json({
        message: "Personal expense added successfully",
        expense_id: result.insertId,
      });
    }
  );
});

/* =====================================================
   3️⃣ GET COMBINED TRANSACTION HISTORY
===================================================== */

router.get("/transactions/:userId", (req, res) => {
  const { userId } = req.params;

  const incomeQuery = `
    SELECT id, amount, source AS title, date, 'income' AS type
    FROM incomes
    WHERE user_id = ?
  `;

  const expenseQuery = `
    SELECT id, amount, title, date, 'personal_expense' AS type
    FROM personal_expenses
    WHERE user_id = ?
  `;

  const sharedQuery = `
    SELECT 
      e.id,
      es.amount,
      e.title,
      e.date,
      'shared_expense' AS type
    FROM expense_splits es
    JOIN expenses e ON es.expense_id = e.id
    WHERE es.user_id = ?
  `;

  db.query(incomeQuery, [userId], (err, incomeResults) => {
    if (err) return res.status(500).json(err);

    db.query(expenseQuery, [userId], (err, expenseResults) => {
      if (err) return res.status(500).json(err);

      db.query(sharedQuery, [userId], (err, sharedResults) => {
        if (err) return res.status(500).json(err);

        const allTransactions = [
          ...incomeResults,
          ...expenseResults,
          ...sharedResults,
        ];

        allTransactions.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        res.json(allTransactions);
      });
    });
  });
});

module.exports = router;