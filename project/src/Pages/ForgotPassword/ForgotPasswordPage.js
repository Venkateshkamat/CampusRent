import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../CSS/ForgotPasswordPage.css'

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    alert(`Password reset link sent to: ${email}`);
    navigate('/verification')
  };

  return (
    <div className="forgot-password-container">
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate(-1)}>
        ←
      </button>

      <h1>Forgot password</h1>
      <p>Please enter your email to reset the password</p>

      <form onSubmit={handleReset}>
        <div className="input-container">
          <label htmlFor="email">Your Email</label>
          <input
            type="email"
            id="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn">
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;