import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const COLORS = [
  "#e74c3c",
  "#3498db",
  "#2ecc71",
  "#f1c40f",
  "#9b59b6",
  "#1abc9c",
];

function ExpenseAnalytics() {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    fetchBarData();
    fetchPieData();
  }, []);

  const fetchBarData = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/analytics/monthly/${user.id}`
    );
    setBarData(res.data);
  };

  const fetchPieData = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/analytics/categories/${user.id}`
    );
    setPieData(res.data);
  };

  const totalNet = barData.reduce(
    (acc, curr) => acc + (curr.income - curr.expense),
    0
  );

  /* Dynamic width for horizontal scrolling */
  const chartWidth = Math.max(barData.length * 120, 600);

  return (
    <div style={{ padding: "40px", background: "#f7f9fc", minHeight: "100vh" }}>

      {/* Back Button */}
      <div
        onClick={() => navigate("/dashboard")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          marginBottom: "10px",
          color: "#444",
          fontWeight: "500"
        }}
      >
        <FaArrowLeft />
        Back to Dashboard
      </div>

      {/* Heading */}
      <h1
        style={{
          fontSize: "36px",
          fontWeight: "700",
          background: "linear-gradient(90deg,#8e2de2,#ff6ec4)",
          WebkitBackgroundClip: "text",
          color: "transparent",
          marginBottom: "30px"
        }}
      >
        Analytics Dashboard
      </h1>

      {/* BAR CHART */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "18px",
          padding: "25px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
        }}
      >

        <h3 style={{ marginBottom: "20px" }}>
          Income vs Expenses
        </h3>

        {/* Horizontal Scroll Container */}
        <div style={{ overflowX: "auto" }}>

          <div style={{ width: chartWidth, height: 350 }}>

            <ResponsiveContainer width="100%" height="100%">

              <BarChart data={barData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Legend />

                {/* SAME COLORS AS YOUR ORIGINAL CODE */}
                <Bar dataKey="income" fill="#2ecc71" />
                <Bar dataKey="expense" fill="#e74c3c" />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* NET SUMMARY */}
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: totalNet >= 0 ? "#e8f8f5" : "#fdecea",
            borderRadius: "8px",
            fontWeight: "bold"
          }}
        >
          Total Net: ₹{totalNet.toLocaleString()}
        </div>

      </div>


      {/* PIE CHART */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "18px",
          padding: "25px",
          marginTop: "40px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
        }}
      >

        <h3 style={{ marginBottom: "20px" }}>
          Expense Breakdown
        </h3>

        <div style={{ width: "100%", height: 350 }}>

          <ResponsiveContainer>

            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >

                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}

              </Pie>

              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}

export default ExpenseAnalytics;