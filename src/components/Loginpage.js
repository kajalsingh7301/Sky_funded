// src/pages/Login.js
import React, { useState } from "react";
import "./Loginpage.css";
import illustration from "../Assets/wave.gif";
import axios from "axios";
import rocket from "../Assets/rocket.png";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // username or email
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!identifier || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      const response = await axios.post("https://api.treassurefunded.com/api/auth/login", {
        email: identifier.includes("@") ? identifier : undefined,
        username: !identifier.includes("@") ? identifier : undefined,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("username", user.username);

      alert("Login successful!");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.msg || "Login failed.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="left-section">
          <h1>Welcome Back!</h1>
          <p>To keep you connected, please login with your personal info.</p>
          <img src={rocket} alt="Illustration" className="rocket" />
        </div>

        <div className="right-section">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
             <div className="labelclass"> <label className="label">Email or Username <span>*</span></label></div>
              <div className="input-box">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  placeholder="name@example.com or username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                Password <span>*</span>
                <i
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer", marginLeft: "10px" }}
                  title={showPassword ? "Hide Password" : "Show Password"}
                ></i>
              </label>
              <div className="input-box">
                <i className="fas fa-lock"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="remember-forgot">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit" className="login-btn">Sign in</button>
          </form>

          <p className="signup-text">
            Don't have an account? <a href="/register">Sign Up</a>
          </p>

          <p className="copyright">
            © Copyright 2025 TreasureFunded. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
