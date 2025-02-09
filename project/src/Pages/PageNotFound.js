import React from "react";
import { Link } from "react-router-dom";
import "../CSS/PageNotFound.css";
import error_404 from '../Images/404_error.png'
require('dotenv').config();
const PageNotFound = () => {
  return (
    <div className="page-not-found-container">
      <img
        src={error_404}
        alt="Page Not Found"
        className="not-found-image"
      />
      <Link to="/" className="go-home-link">
        Go to Login Page
      </Link>
    </div>
  );
};

export default PageNotFound;