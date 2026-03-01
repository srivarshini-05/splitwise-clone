import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./addExpense.css";

function AddExpense() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const submitExpense = async () => {
    if (!title || !amount || !date) return;

    try {
      await axios.post(
        `http://splitwise-clone-production.up.railway.app/api/groups/${groupId}/add-expense`,
        {
          title,
          total_amount: amount,
          paid_by: user.id,
          date,
        }
      );

      navigate(`/group/${groupId}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="add-expense-page">

      {/* Back */}
      <div className="back-btn" onClick={() => navigate(`/group/${groupId}`)}>
        ← Back to Group
      </div>

      {/* Header */}
      <div className="add-expense-header">
        <div className="add-expense-title">

          <div className="expense-icon">$</div>

          <h1>Add New Expense</h1>

        </div>
      </div>

      {/* Form Card */}
      <div className="expense-card">

        <label>Expense Title</label>
        <input
          type="text"
          placeholder="e.g., Dinner at Restaurant"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Amount</label>
        <input
          type="number"
          placeholder="₹ 0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button className="add-expense-btn" onClick={submitExpense}>
          + Add Expense
        </button>

      </div>

    </div>
  );
}

export default AddExpense;