import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../CSS/VerificationCodePage.css'

function VerificationCodePage() {
  const [code, setCode] = useState(new Array(5).fill(""));
  const navigate = useNavigate();

  const handleChange = (value, index) => {
    // Update the code array
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to the next input field automatically
    if (value && index < code.length - 1) {
      document.getElementById(`code-${index + 1}`).focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.join("").length === 5) {
      alert("Code verified successfully!");
      navigate('/set-new-password')
    } else {
      alert("Please enter a valid 5-digit code.");
    }
  };

  return (
    <div className="verification-code-container">
      <h1>Check your email</h1>
      <p>
        We sent a reset link to <strong>example@gmail.com</strong>
        <br />
        Enter the 5-digit code mentioned in the email.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="code-inputs">
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              id={`code-${index}`}
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && index > 0 && !code[index]) {
                  document.getElementById(`code-${index - 1}`).focus();
                }
              }}
            />
          ))}
        </div>
        <button type="submit" className="btn">
          Verify Code
        </button>
      </form>
      <p className="resend-text">
        Haven’t got the email yet? <a href="#">Resend email</a>
      </p>
    </div>
  );
}

export default VerificationCodePage;