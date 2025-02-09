import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/NewLendPage.css";
import Navbar from "./Navbar";
require('dotenv').config();
const NewLendPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: 1,
    category: "",
    location: "",
    rentalStartDate: "",
    rentalEndDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "./";
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to discard the changes?"
    );
    if (!confirmCancel) return;

    navigate('/home')
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const token = localStorage.getItem("authToken"); // Get authToken for authorization
    if (!token) {
      alert("Please log in to lend an item.");
      return;
    }

    if (formData.category === "" || formData.name === "" || formData.description === "" || formData.price === "" || formData.rentalStartDate === "" || formData.rentalEndDate === "" || formData.location === "") {
      alert("Fill in all the blanks")
      return;
    }

    try {
      // Convert rentalStartDate and rentalEndDate to Date objects
      const rentStartDate = new Date(formData.rentalStartDate);
      const rentEndDate = new Date(formData.rentalEndDate);

      const response = await fetch(`{process.env.BACKEND_URL}/api/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include authToken in the headers
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          stock: formData.stock,
          category: formData.category,
          location: formData.location,
          rent_start: rentStartDate,
          rent_end: rentEndDate,
        }),
      });

      const result = await response.json();
      console.log("Form Data:", formData);

      if (response.ok) {
        alert(`Item created successfully with ID: ${result.data._id}`);
        setFormData({
          name: "",
          description: "",
          price: "",
          stock: "",
          category: "",
          location: "",
          rentalStartDate: "",
          rentalEndDate: "",
        });
        navigate('/home')
      } else {
        alert(`Failed to create item: ${result.message}`);
      }
    } catch (error) {
      console.error("Error creating item:", error);
      alert("An error occurred while creating the item. Please try again.");
    }
  };

  return (
    <div className="new-lend-page-container">
      <Navbar handleLogout={handleLogout} />

      <form className="form-container">
        {/* Left Section - Image with Navigation */}
        <div className="image-section">
          <button className="nav-button">&lt;</button>
          <div className="image-uploader">
            <button className="image-button">+</button>
          </div>
          <button className="nav-button">&gt;</button>
        </div>

        {/* Right Section - Form Fields */}
        <div className="fields-section">
          <div className="row-group">
            <div className="input-group">
              <label>Pick Category</label>
              <select
                className="input-field"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Choose One</option>
                <option value="Electronics">Electronics</option>
                <option value="Books">Books</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothes">Clothes</option>
                <option value="Footwear">Footwear</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div className="input-group">
              <label>Name of Item</label>
              <input
                type="text"
                className="input-field"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Item Name"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Cost ($ per day)</label>
            <input
              type="number"
              className="input-field"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="$ Amount"
            />
          </div>

          <div className="input-group">
            <label>Description</label>
            <input
              type="text"
              className="input-field"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a short description"
            />
          </div>

          <div className="row-group">
            <div className="input-group">
              <label>Rental Initial Date</label>
              <input
                type="date"
                className="input-field"
                name="rentalStartDate"
                value={formData.rentalStartDate}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Rental Last Date</label>
              <input
                type="date"
                className="input-field"
                name="rentalEndDate"
                value={formData.rentalEndDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Location</label>
            <input
              type="text"
              className="input-field"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
            />
          </div>

          {/* Submit Button */}
          <div className="button-row">
            <div className="submit-container">
              <button type="submit" className="submit-button" onClick={handleSubmit}>
                Post Online
              </button>
            </div>
            <div className="submit-container">
              <button type="submit" className="submit-button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewLendPage;