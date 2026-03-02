import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./budget.css";

function BudgetTracker() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
  if (!user) {
    navigate("/");
    return;
  }

  const fetchBudgets = async () => {
    try {
      const res = await axios.get(
        `http://splitwise-server-b4zr.onrender.com/api/budget/${user.id}`
      );
      setBudgets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchBudgets();
}, [navigate, user]);

  const fetchBudgets = async () => {
    try {
      const res = await axios.get(
        `http://splitwise-server-b4zr.onrender.com/api/budget/${user.id}`
      );
      setBudgets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetBudget = async () => {
    if (!category || !limit) return;

    try {
      await axios.post("http://splitwise-server-b4zr.onrender.com/api/budget/set", {
        user_id: user.id,
        category,
        monthly_limit: limit,
      });

      setCategory("");
      setLimit("");

      fetchBudgets();
    } catch (err) {
      console.error(err);
    }
  };

  const getColor = (usage) => {
    if (usage > 100) return "#ff4d4f";
    if (usage >= 80) return "#f5a623";
    return "#10b981";
  };

  return (
    <div className="budget-page">

      {/* Back Button */}
      <div className="back-btn" onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </div>

      {/* Page Header */}
      <div className="budget-header">
        <div className="budget-icon">🎯</div>
        <h1>Budget Tracker</h1>
      </div>

      {/* Budget Form */}
      <div className="budget-form-card">
        <h3>Set Monthly Budget</h3>

        <div className="form-row">
          <div className="form-group">
            <label>Select Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Rent">Rent</option>
              <option value="Shopping">Shopping</option>
              <option value="Transport">Transport</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Utilities">Utilities</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Total Budget</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />
          </div>
        </div>

        <button className="save-btn" onClick={handleSetBudget}>
          Save Budget
        </button>
      </div>

      {/* Budget Cards */}
      {budgets.map((item, index) => {
        const color = getColor(item.usage);

        return (
          <div key={index} className="budget-card">

            <div className="budget-card-header">
              <h3>{item.category}</h3>
              <span className="status-badge">Remaining</span>
            </div>

            <div className="budget-amount">
              ₹{item.spent.toLocaleString()} 
              <span> / ₹{item.limit.toLocaleString()}</span>
              <span className="usage">{item.usage}%</span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(item.usage, 100)}%`,
                  background: color
                }}
              />
            </div>

            <div className="remaining-box">
              ₹{item.remaining.toLocaleString()} remaining out of ₹
              {item.limit.toLocaleString()}
            </div>

          </div>
        );
      })}
    </div>
  );
}

export default BudgetTracker;