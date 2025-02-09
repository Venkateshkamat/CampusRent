import React, { useState } from "react";
import '../CSS/LoginPage.css'
import { useNavigate } from "react-router-dom";
require('dotenv').config();
function LoginPage() {
  const navigate = useNavigate(); // Initialize the navigate function
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    // alert(`Logging in with Email: ${email}, Password: ${password}`);
    e.preventDefault();
    try {
      const response = await fetch(`{process.env.BACKEND_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password })
      });

      const result = await response.json();

      if (response.ok) {
        // Save token in localStorage or cookie for subsequent requests
        localStorage.setItem("authToken", result.data);
        // Optionally redirect the user or update the UI state
        navigate("/home")
      } else {
        alert(`Login failed: ${result.msg}`);
      }
    } catch (error) {
      console.log(error)
      alert(error);
    }
  };

  return (
    <div className="login-body">
      <div className="container">
        <h1>CampusRent</h1>
        <h2>Sign in</h2>
        <form onSubmit={handleLogin}>
          <div className="input-container">
            <label htmlFor="email">
              <i className="fa fa-user"></i>
              <input
                type="username"
                id="email"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="input-container">
            <label htmlFor="password" className="input-label">
              <div className="icon-container">
                <i className="fa fa-lock"></i>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fa ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
              </button>
            </label>
          </div>

          <a href="/forgot-password" className="forgot-password">
            Forgot Password?
          </a>
          <button type="submit" className="btn">
            LOGIN
          </button>
        </form>
        <p className="register-text">
          <a href="/signup"><span style={{ color: '#000000' }}>Don't have an account?</span> Register</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
