import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaWallet, FaChartLine, FaChartBar, FaPiggyBank } from "react-icons/fa";
import "./financialOverview.css";

function FinancialOverview() {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState(null);

  useEffect(() => {

    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOverview = async () => {
      try {
        const response = await axios.get(
          `http://splitwise-server-b4zr.onrender.com/api/overview/${user.id}`
        );
        setData(response.data);
      } catch (error) {
        console.error("Overview fetch error:", error);
      }
    };

    fetchOverview();

  }, [navigate, user]);

  if (!data) {
    return <h3 className="loading">Loading...</h3>;
  }

  const totalExpenses =
    parseFloat(data.personal_expenses) +
    Math.max(0, -parseFloat(data.shared_balance));

  const currentBalance =
    parseFloat(data.total_income) - totalExpenses;

  return (

    <div className="overview-page">

      {/* Back Button */}
      <div className="back-btn" onClick={() => navigate("/dashboard")}>
        <FaArrowLeft />
        Back to Dashboard
      </div>

      {/* Title */}
      <h1 className="overview-title">Financial Overview</h1>

      {/* Cards */}
      <div className="overview-grid">

        {/* Current Balance */}
        <div className="overview-card card-blue">
          <div className="icon-box gradient-blue">
            <FaWallet />
          </div>

          <p className="card-title">Current Balance</p>

          <h2 className="amount">
            ₹{currentBalance.toFixed(2)}
          </h2>

          <span className="subtext">
            This Month
          </span>
        </div>

        {/* Total Income */}
        <div className="overview-card card-green">
          <div className="icon-box gradient-green">
            <FaChartLine />
          </div>

          <p className="card-title">Total Income</p>

          <h2 className="amount green">
            ₹{parseFloat(data.total_income).toFixed(2)}
          </h2>
        </div>

        {/* Total Expenses */}
        <div className="overview-card card-red">
          <div className="icon-box gradient-red">
            <FaChartBar />
          </div>

          <p className="card-title">Total Expenses</p>

          <h2 className="amount red">
            ₹{totalExpenses.toFixed(2)}
          </h2>
        </div>

        {/* Net Savings */}
        <div className="overview-card card-purple">
          <div className="icon-box gradient-purple">
            <FaPiggyBank />
          </div>

          <p className="card-title">Net Savings</p>

          <h2 className="amount blue">
            ₹{parseFloat(data.net_savings).toFixed(2)}
          </h2>

          <span className="subtext">
            Savings Rate: {data.savings_rate}%
          </span>
        </div>

      </div>

    </div>
  );
}

export default FinancialOverview;