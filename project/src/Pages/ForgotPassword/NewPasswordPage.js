import React, { useState } from "react";
import '../../CSS/NewPasswordPage.css'
import { useNavigate } from "react-router-dom";

function NewPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
    } else {
      alert("Password updated successfully!");
      navigate('/')
    }
  };

  return (
    <div className="new-password-container">
      <h1>Set a new password</h1>
      <p>
        Create a new password. Ensure it differs from previous ones for
        security.
      </p>

      <form onSubmit={handleUpdatePassword}>
        {/* Password Field */}
        <div className="input-container">
          <label htmlFor="password">Password</label>
          <div className="input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="input-container">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn">
          Update Password
        </button>
      </form>
    </div>
  );
}

export default NewPasswordPage;
