const express = require("express");
const router = express.Router();
const db = require("../db");

/* =====================================================
   MONTHLY INCOME VS EXPENSE
===================================================== */

router.get("/monthly/:userId", (req, res) => {
  const { userId } = req.params;

  const incomeQuery = `
    SELECT 
      DATE_FORMAT(date, '%b') AS month,
      MONTH(date) AS month_number,
      SUM(amount) AS total_income
    FROM incomes
    WHERE user_id = ?
    GROUP BY month, month_number
  `;

  const expenseQuery = `
    SELECT 
      DATE_FORMAT(date, '%b') AS month,
      MONTH(date) AS month_number,
      SUM(amount) AS total_expense
    FROM personal_expenses
    WHERE user_id = ?
    GROUP BY month, month_number
  `;

  db.query(incomeQuery, [userId], (err, incomeResults) => {
    if (err) return res.status(500).json(err);

    db.query(expenseQuery, [userId], (err, expenseResults) => {
      if (err) return res.status(500).json(err);

      const monthMap = {};

      // Income data
      incomeResults.forEach((row) => {
        monthMap[row.month_number] = {
          month: row.month,
          month_number: row.month_number,
          income: parseFloat(row.total_income),
          expense: 0,
        };
      });

      // Expense data
      expenseResults.forEach((row) => {
        if (!monthMap[row.month_number]) {
          monthMap[row.month_number] = {
            month: row.month,
            month_number: row.month_number,
            income: 0,
            expense: parseFloat(row.total_expense),
          };
        } else {
          monthMap[row.month_number].expense = parseFloat(row.total_expense);
        }
      });

      // Sort properly and clean response
      const finalData = Object.values(monthMap)
        .sort((a, b) => a.month_number - b.month_number)
        .map(({ month, income, expense }) => ({
          month,
          income,
          expense,
        }));

      res.json(finalData);
    });
  });
});

/* =====================================================
   CATEGORY BREAKDOWN
===================================================== */

router.get("/categories/:userId", (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT category, SUM(amount) AS total
    FROM personal_expenses
    WHERE user_id = ?
    GROUP BY category
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json(err);

    const formatted = results.map((row) => ({
      name: row.category || "Other",
      value: parseFloat(row.total),
    }));

    res.json(formatted);
  });
});

module.exports = router;