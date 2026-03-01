import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaWallet, FaChartLine, FaBullseye, FaHeartbeat, FaUsers } from "react-icons/fa";
import "./dashboard.css";

function Dashboard({ setUser }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(user.id);
    alert("User ID copied!");
  };

  const features = [
    {
      title: "Financial Overview",
      description: "View your complete financial summary and balance",
      route: "/overview",
      icon: <FaWallet />,
      color: "gradient1"
    },
    {
      title: "Expense Analytics",
      description: "Analyze your spending patterns and trends",
      route: "/analytics",
      icon: <FaChartLine />,
      color: "gradient2"
    },
    {
      title: "Budget Tracker",
      description: "Set and monitor your monthly budget limits",
      route: "/budget",
      icon: <FaBullseye />,
      color: "gradient3"
    },
    {
      title: "Recent Activity",
      description: "Add income, expenses and view transaction history",
      route: "/transactions",
      icon: <FaHeartbeat />,
      color: "gradient4"
    },
  ];

  if (!user) return null;

  return (
    <div className="dashboard">

      {/* Header */}
      <div className="dashboard-header">

        <div>
          <h1 className="title">Dashboard</h1>

          <p className="welcome">
            Welcome Back, {user.name}
          </p>

          <p className="subtext">
            Track your finances and track spending with ease
          </p>

          <div className="user-id">
            <span>USER ID :</span>
            <div className="id-badge">{user.id}</div>
            <button onClick={handleCopyId}>Copy</button>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

      </div>

      {/* Feature Cards */}
      <div className="feature-grid">
        {features.map((feature, index) => (
          <div
            key={index}
            className="feature-card"
            onClick={() => navigate(feature.route)}
          >

            <div className={`feature-icon ${feature.color}`}>
              {feature.icon}
            </div>

            <h3>{feature.title}</h3>
            <p>{feature.description}</p>

          </div>
        ))}
      </div>

      {/* Shared Expense Section */}
      <div className="shared-expense">

        <div className="shared-header">
          <div className="shared-icon">
            <FaUsers />
          </div>

          <div>
            <h3>Shared Expenses</h3>
            <p>
              Manage group expenses and split bills with friends and family
            </p>

            <span
              className="shared-link"
              onClick={() => navigate("/shared")}
            >
              View Shared Expenses →
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;