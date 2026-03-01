import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Intro() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const user = JSON.parse(localStorage.getItem("user"));

      if (user) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px",
        background:
          "linear-gradient(180deg,#f6b2c6 0%, #d6a4ff 50%, #c9c7ff 100%)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Title */}
      <h1
        style={{
          fontSize: "38px",
          fontWeight: "700",
          marginBottom: "10px",
        }}
      >
        Welcome :)
      </h1>

      {/* Subtitle */}
      <h3
        style={{
          fontWeight: "500",
          marginBottom: "12px",
        }}
      >
        Hi there!
      </h3>

      {/* Description */}
      <p
        style={{
          maxWidth: "320px",
          fontSize: "15px",
          lineHeight: "1.5",
          opacity: 0.8,
        }}
      >
        Track your spending, manage budgets, and split expenses with friends —
        all in one smart expense tracker.
      </p>

      {/* Illustration */}
      <img
        src="https://cdn-icons-png.flaticon.com/512/3135/3135679.png"
        alt="expense illustration"
        style={{
          width: "170px",
          marginTop: "40px",
          marginBottom: "30px",
        }}
      />

      {/* Loader */}
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid rgba(0,0,0,0.2)",
          borderTop: "4px solid black",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />

      <style>
        {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        `}
      </style>
    </div>
  );
}

export default Intro;