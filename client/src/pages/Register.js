import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./register.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://splitwise-server-b4zr.onrender.com/api/auth/register",
        form
      );

      alert("Registered successfully");

      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">

      <div className="register-card">

        <h1>Create Your Account</h1>

        <p className="subtitle">
          Track your expenses, manage budgets, and take control of your finances. Ready to get started?
        </p>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            onChange={handleChange}
            required
          />

          <button type="submit">Get Started</button>

        </form>

        <p className="login-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>
            Log In
          </span>
        </p>

      </div>

    </div>
  );
}

export default Register;