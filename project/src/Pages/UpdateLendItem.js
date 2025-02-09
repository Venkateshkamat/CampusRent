import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../CSS/NewLendPage.css";
import Navbar from "./Navbar";
require('dotenv').config();
const UpdateLendItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await fetch(`{process.env.BACKEND_URL}/api/items/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (response.ok) {
          setItem(result.data); // Set the item details
        } else {
          // alert(`Failed to fetch item details: ${result.message}`);
        }
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    };
    fetchItemDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );
    if (!confirmLogout) return;

    localStorage.removeItem("authToken");
    window.location.href = "./";
  };

  const handleEdit = async (e) => {
    e.preventDefault(); // Prevent default form behavior

    if (item.category === "" || item.name === "" || item.description === "" || item.price === "" || item.rentalStartDate === "" || item.rentalEndDate === "" || item.location === "") {
      alert("Fill in all the blanks")
      return;
    }

    const confirmEdit = window.confirm(
      "Are you sure you want to confirm your edits?"
    );
    if (!confirmEdit) return;

    const token = localStorage.getItem("authToken"); // Get auth token
    if (!token) {
      alert("You must be logged in to edit an item.");
      return;
    }

    try {
      const response = await fetch(`{process.env.BACKEND_URL}/api/items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token for authentication
        },
        body: JSON.stringify({
          name: item.name,
          description: item.description,
          price: item.price,
          stock: item.stock,
          category: item.category,
          location: item.location,
          rent_start: item.rent_start,
          rent_end: item.rent_end,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Item updated successfully!");
        navigate('/home')
        // Optionally navigate or update the UI
      } else {
        alert(`Failed to update item: ${result.message}`);
      }
    } catch (error) {
      console.error("Error updating item:", error);
      alert("An error occurred while updating the item. Please try again.");
    }
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to discard the changes?"
    );
    if (!confirmCancel) return;

    navigate('/home')
  }

  return (
    <div className="new-lend-page-container">
      <Navbar handleLogout={handleLogout} />
      {item ? (
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
                  value={item.category || ""}
                  onChange={handleChange}
                >
                  <option value="">Choose One</option>
                  <option value="Books">Books</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                </select>
              </div>

              <div className="input-group">
                <label>Name of Item</label>
                <input
                  type="text"
                  className="input-field"
                  name="name"
                  value={item.name || ""}
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
                value={item.price || ""}
                onChange={handleChange}
                placeholder="$ Amount"
              />
            </div>

            {/* New Text Field */}
            <div className="input-group">
              <label>Description</label>
              <input
                type="text"
                className="input-field"
                name="description"
                value={item.description}
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
                  name="rent_start"
                  value={item.rent_start ? new Date(item.rent_start).toISOString().split("T")[0] : ""}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Rental Last Date</label>
                <input
                  type="date"
                  className="input-field"
                  name="rent_end"
                  value={item.rent_end ? new Date(item.rent_end).toISOString().split("T")[0] : ""}
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
                value={item.location || ""}
                onChange={handleChange}
                placeholder="Location"
              />
            </div>

            {/* Submit Button */}
            <div className="button-row">
              <div className="submit-container">
                <button type="submit" className="submit-button" onClick={handleEdit}>
                  Save Edit
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
      ) : (
        <p>Loading item details...</p>
      )}
    </div>
  );
};

export default UpdateLendItem;