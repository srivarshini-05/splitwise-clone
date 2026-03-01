const express = require("express");
const router = express.Router();
const db = require("../db");

/* =====================================================
   TEST ROUTE
===================================================== */

router.get("/test", (req, res) => {
  res.send("Groups route working");
});

/* =====================================================
   CREATE GROUP
===================================================== */

router.post("/create", (req, res) => {
  const { name, description, created_by, members } = req.body;

  if (!name || !created_by) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  db.beginTransaction((err) => {
    if (err) return res.status(500).json(err);

    db.query(
      "INSERT INTO user_groups (name, description, created_by) VALUES (?, ?, ?)",
      [name, description || "", created_by],
      (err, result) => {
        if (err) return db.rollback(() => res.status(500).json(err));

        const groupId = result.insertId;
        const allMembers = [...new Set([...(members || []), created_by])];
        const values = allMembers.map((userId) => [groupId, userId]);

        db.query(
          "INSERT INTO group_members (group_id, user_id) VALUES ?",
          [values],
          (err) => {
            if (err) return db.rollback(() => res.status(500).json(err));

            db.commit((err) => {
              if (err) return db.rollback(() => res.status(500).json(err));

              res.json({
                message: "Group created successfully",
                group_id: groupId,
              });
            });
          }
        );
      }
    );
  });
});

/* =====================================================
   GET USER GROUPS
===================================================== */

router.get("/user/:userId", (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT g.id, g.name, g.description,
    COUNT(gm.user_id) AS total_members
    FROM user_groups g
    JOIN group_members gm ON g.id = gm.group_id
    WHERE g.id IN (
      SELECT group_id FROM group_members WHERE user_id = ?
    )
    GROUP BY g.id
  `;

  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

/* =====================================================
   GET GROUP DETAILS
===================================================== */

router.get("/:groupId", (req, res) => {
  const { groupId } = req.params;

  const groupQuery = `
    SELECT id, name, description
    FROM user_groups
    WHERE id = ?
  `;

  const membersQuery = `
    SELECT u.id, u.name
    FROM users u
    JOIN group_members gm ON u.id = gm.user_id
    WHERE gm.group_id = ?
  `;

  db.query(groupQuery, [groupId], (err, group) => {
    if (err) return res.status(500).json(err);

    db.query(membersQuery, [groupId], (err, members) => {
      if (err) return res.status(500).json(err);

      res.json({
        group: group[0],
        members,
      });
    });
  });
});

/* =====================================================
   ADD EXPENSE (Equal Split)
===================================================== */

router.post("/:groupId/add-expense", (req, res) => {
  const { groupId } = req.params;
  const { title, total_amount, paid_by, date, notes } = req.body;

  if (!title || !total_amount || !paid_by) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  db.beginTransaction((err) => {
    if (err) return res.status(500).json(err);

    db.query(
      `INSERT INTO expenses (group_id, title, total_amount, paid_by, date, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [groupId, title, total_amount, paid_by, date, notes || ""],
      (err, result) => {
        if (err) return db.rollback(() => res.status(500).json(err));

        const expenseId = result.insertId;

        db.query(
          "SELECT user_id FROM group_members WHERE group_id = ?",
          [groupId],
          (err, members) => {
            if (err) return db.rollback(() => res.status(500).json(err));

            const splitAmount =
              parseFloat(total_amount) / members.length;

            const values = members.map((m) => [
              expenseId,
              m.user_id,
              splitAmount,
            ]);

            db.query(
              "INSERT INTO expense_splits (expense_id, user_id, amount) VALUES ?",
              [values],
              (err) => {
                if (err) return db.rollback(() => res.status(500).json(err));

                db.commit((err) => {
                  if (err) return db.rollback(() => res.status(500).json(err));
                  res.json({ message: "Expense added successfully" });
                });
              }
            );
          }
        );
      }
    );
  });
});

/* =====================================================
   GET GROUP BALANCE (WITH SETTLEMENTS)
===================================================== */

router.get("/:groupId/balances/:userId", (req, res) => {
  const { groupId, userId } = req.params;

  const query = `
    SELECT 
      (
        IFNULL(paid.total_paid, 0)
        - IFNULL(owed.total_owed, 0)
        - IFNULL(received.total_received, 0)
        + IFNULL(sent.total_sent, 0)
      ) AS balance
    FROM users u
    LEFT JOIN (
        SELECT paid_by, SUM(total_amount) AS total_paid
        FROM expenses
        WHERE group_id = ?
        GROUP BY paid_by
    ) paid ON u.id = paid.paid_by
    LEFT JOIN (
        SELECT es.user_id, SUM(es.amount) AS total_owed
        FROM expense_splits es
        JOIN expenses e ON es.expense_id = e.id
        WHERE e.group_id = ?
        GROUP BY es.user_id
    ) owed ON u.id = owed.user_id
    LEFT JOIN (
        SELECT to_user, SUM(amount) AS total_received
        FROM settlements
        WHERE group_id = ?
        GROUP BY to_user
    ) received ON u.id = received.to_user
    LEFT JOIN (
        SELECT from_user, SUM(amount) AS total_sent
        FROM settlements
        WHERE group_id = ?
        GROUP BY from_user
    ) sent ON u.id = sent.from_user
    WHERE u.id = ?
  `;

  db.query(
    query,
    [groupId, groupId, groupId, groupId, userId],
    (err, result) => {
      if (err) return res.status(500).json(err);

      const balance = parseFloat(result[0].balance || 0);

      res.json({
        balance,
        you_owe: balance < 0 ? Math.abs(balance) : 0,
        you_are_owed: balance > 0 ? balance : 0,
      });
    }
  );
});

/* =====================================================
   GET OPTIMIZED SETTLEMENTS (LIVE)
===================================================== */

router.get("/:groupId/settlements", (req, res) => {
  const { groupId } = req.params;

  const balanceQuery = `
    SELECT 
      u.id,
      u.name,
      (
        IFNULL(paid.total_paid, 0)
        - IFNULL(owed.total_owed, 0)
        - IFNULL(received.total_received, 0)
        + IFNULL(sent.total_sent, 0)
      ) AS balance
    FROM users u
    JOIN group_members gm ON u.id = gm.user_id
    LEFT JOIN (
        SELECT paid_by, SUM(total_amount) AS total_paid
        FROM expenses
        WHERE group_id = ?
        GROUP BY paid_by
    ) paid ON u.id = paid.paid_by
    LEFT JOIN (
        SELECT es.user_id, SUM(es.amount) AS total_owed
        FROM expense_splits es
        JOIN expenses e ON es.expense_id = e.id
        WHERE e.group_id = ?
        GROUP BY es.user_id
    ) owed ON u.id = owed.user_id
    LEFT JOIN (
        SELECT to_user, SUM(amount) AS total_received
        FROM settlements
        WHERE group_id = ?
        GROUP BY to_user
    ) received ON u.id = received.to_user
    LEFT JOIN (
        SELECT from_user, SUM(amount) AS total_sent
        FROM settlements
        WHERE group_id = ?
        GROUP BY from_user
    ) sent ON u.id = sent.from_user
    WHERE gm.group_id = ?
  `;

  db.query(
    balanceQuery,
    [groupId, groupId, groupId, groupId, groupId],
    (err, results) => {
      if (err) return res.status(500).json(err);

      let creditors = [];
      let debtors = [];

      results.forEach((user) => {
        const balance = parseFloat(user.balance);

        if (balance > 0) {
          creditors.push({ id: user.id, name: user.name, balance });
        } else if (balance < 0) {
          debtors.push({
            id: user.id,
            name: user.name,
            balance: Math.abs(balance),
          });
        }
      });

      let settlements = [];
      let i = 0;
      let j = 0;

      while (i < debtors.length && j < creditors.length) {
        let debtor = debtors[i];
        let creditor = creditors[j];

        let amount = Math.min(debtor.balance, creditor.balance);

        settlements.push({
          from: debtor.name,
          from_id: debtor.id,
          to: creditor.name,
          to_id: creditor.id,
          amount: Number(amount.toFixed(2)),
        });

        debtor.balance -= amount;
        creditor.balance -= amount;

        if (debtor.balance < 0.01) i++;
        if (creditor.balance < 0.01) j++;
      }

      res.json(settlements);
    }
  );
});

/* =====================================================
   MARK SETTLEMENT AS PAID
===================================================== */

router.post("/:groupId/settle", (req, res) => {
  const { groupId } = req.params;
  const { from_user, to_user, amount } = req.body;

  db.query(
    "INSERT INTO settlements (group_id, from_user, to_user, amount) VALUES (?, ?, ?, ?)",
    [groupId, from_user, to_user, amount],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Settlement recorded" });
    }
  );
});

/* =====================================================
   GET PAID SETTLEMENTS
===================================================== */

router.get("/:groupId/paid-settlements", (req, res) => {
  const { groupId } = req.params;

  db.query(
    "SELECT from_user, to_user, amount FROM settlements WHERE group_id = ?",
    [groupId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

/* =====================================================
   GET GROUP TRANSACTIONS
===================================================== */

router.get("/:groupId/transactions", (req, res) => {
  const { groupId } = req.params;

  const query = `
    SELECT 
      e.id,
      e.title,
      e.total_amount,
      e.date,
      u.name AS paid_by_name,
      COUNT(es.user_id) AS total_members,
      (e.total_amount / COUNT(es.user_id)) AS per_person
    FROM expenses e
    JOIN users u ON e.paid_by = u.id
    JOIN expense_splits es ON e.id = es.expense_id
    WHERE e.group_id = ?
    GROUP BY e.id
    ORDER BY e.date DESC
  `;

  db.query(query, [groupId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

module.exports = router;