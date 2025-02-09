import React, { useState } from "react";
import "../CSS/Navbar.css";
require('dotenv').config();
const Navbar = ({ handleLogout, onSearch }) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    onSearch(searchInput);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">Campus Rent</div>
      <div className="navbar-search">
        <input
          type="text"
          value={searchInput}
          onKeyDown={handleKeyDown}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for products, brands and more"
        />
        <button onClick={handleSearch}>🔍</button>
      </div>
      <div className="navbar-links">
        <a href="/home">Home</a>
        <a href="/profile">Profile</a>
        <a
          href="./"
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          Logout
        </a>
      </div>
    </header>
  );
};

export default Navbar;
