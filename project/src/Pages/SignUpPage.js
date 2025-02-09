import React, { useState } from "react";
import "../CSS/SignUpPage.css";
import { useNavigate } from "react-router-dom";
require('dotenv').config();
function SignUpPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    try {
      const response = await fetch(`{process.env.BACKEND_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: fullName, email: email, username: username, password: password })
      });

      const result = await response.json();

      if (result.ok) {
        alert("Register successful !!");
        navigate("/")
      } else {
        // alert(`Register failed: ${result.msg}`);
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="signup-body">
      <div className="signup-container">
        <h1>CampusRent</h1>
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="input-container">
            <label htmlFor="fullName">
              <i className="fa fa-user"></i>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full name"
                required
              />
            </label>
          </div>

          {/* User Name */}
          <div className="input-container">
            <label htmlFor="username">
              <i className="fa fa-user"></i>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
            </label>
          </div>

          {/* Email */}
          <div className="input-container">
            <label htmlFor="email">
              <i className="fa fa-envelope icon"></i>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="abc@email.com"
                required
              />
            </label>
          </div>

          {/* Password */}
          <div className="input-container">
            <label htmlFor="password">
              <i className="fa fa-lock"></i>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
              </button>
            </label>
          </div>

          {/* Confirm Password */}
          <div className="input-container">
            <label htmlFor="confirmPassword">
              <i className="fa fa-lock"></i>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
              </button>
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn">
            REGISTER
          </button>
        </form>

        <p className="register-text">
          <a href="/"><span style={{ color: '#000000' }}>Already have an account?</span> Login</a>
        </p>

      </div>
    </div>
  );
}

export default SignUpPage;
