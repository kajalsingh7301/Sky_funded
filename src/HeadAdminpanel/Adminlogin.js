import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Adminlogin.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("adminToken", data.token);
        navigate("/headadmin");
      } else {
        alert("Login failed: " + (data.message || "Invalid credentials"));
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Error logging in. Try again.");
    }
  };

  return (
    <div className="skyfunded-login-bg">
      <form className="skyfunded-login-form" onSubmit={handleSubmit}>
        <h2>SkyFunded Admin Login</h2>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@skyfunded.com"
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
