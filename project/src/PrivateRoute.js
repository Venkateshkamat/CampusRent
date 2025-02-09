import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const authToken = localStorage.getItem("authToken");

  // Redirect to login if authToken is not available
  if (!authToken) {
    return <Navigate to="/" replace />;
  }
  
  // If authToken exists, render the children (protected component)
  return children;
};

export default PrivateRoute;