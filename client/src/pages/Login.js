import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login({ setUser }) {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post(
        "http://splitwise-clone-production.up.railway.app/api/auth/login",
        form
      );

      const userData = response.data.user;

      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);

      navigate("/dashboard");

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <h1>Welcome Back</h1>

        <p className="subtitle">
          Ready to track your spending again? Your financial dashboard is waiting.
        </p>

        <form onSubmit={handleLogin}>

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
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit">Log In</button>

        </form>

        <p className="register">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>
            Sign Up
          </span>
        </p>

      </div>

    </div>
  );
}

export default Login;