import React from 'react';
import "../CSS/ItemDetailPage.css";
import Navbar from './Navbar';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
require('dotenv').config();
function ItemDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [ownerDetails, setOwnerDetails] = useState({});
  const [reservedBy, setReservedBy] = useState(null);

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
          setReservedBy(result.username);
          fetchOwnerDetails(result.data.owner);
        } else {
          alert(`Failed to fetch item details: ${result.message}`);
        }
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    };

    const fetchOwnerDetails = async (ownerInfo) => {
      try {
        const response = await fetch(`{process.env.BACKEND_URL}/api/users/profile/${ownerInfo._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (response.ok) {
          setOwnerDetails(result.data); // Store owner details
        } else {
          alert(`Failed to fetch owner details: ${result.msg}`);
        }
      } catch (error) {
        console.error("Error fetching owner details:", error);
      }
    };

    fetchItemDetails();
  }, [id]);

  if (!item) {
    return <p>Loading item details...</p>;
  }

  const handleLogout = () => {

    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );
    if (!confirmLogout) return;

    localStorage.removeItem("authToken");
    alert("Logged out successfully!");
    window.location.href = "/";
  };

  const handleReserve = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You must be logged in to reserve this item.");
      return;
    }

    try {
      const response = await fetch(`{process.env.BACKEND_URL}/api/items/rent/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Pass the token for authorization
        },
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Item reserved successfully: ${result.data.name}`);
        // Optionally update the item's status locally
        setItem((prev) => ({ ...prev, status: "rented", rented_by: "You" }));
        setReservedBy(result.username);

      } else {
        alert(`Failed to reserve item: ${result.message}`);
      }
    } catch (error) {
      console.error("Error reserving the item:", error);
      alert("An error occurred while reserving the item.");
    }
  };

  if (!item) {
    return <p>Loading item details...</p>;
  }

  return (
    <div className="item-detail-page-container">
      <Navbar handleLogout={handleLogout} />
      <div className="item-detail-container">
        <div className="item-content">
          <div className="item-details">
            <div className="image-slider">
              <button className="slider-button">{'<'}</button>
              <div className="image-placeholder"></div>
              <button className="slider-button">{'>'}</button>
            </div>
            <div className="item-info">
              <p><strong>Name:</strong> {item.name} </p>
              <p><strong>Cost:</strong> ${item.price}/day</p>
              <p><strong>Rental Start Date:</strong> {new Date(item.rent_start).toLocaleDateString()} </p>
              <p><strong>Rental End Date:</strong> {new Date(item.rent_end).toLocaleDateString()} </p>
              <p>
                <strong>Location:</strong>{" "}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.location}
                </a>
              </p>
            </div>
          </div>

          <div className="owner-details">
            <h3 className="contact-title">Lender's Contact Information</h3>
            <div className="owner-header">
              <div className="owner-image"></div>
              <div>
                <p className="owner-name">{ownerDetails.name || "Loading..."}</p>
                <p className="rating">⭐ 4.5</p>
              </div>
            </div>
            <div className="contact-info">
              {/* <p>
                <strong>Social Media:</strong>
                <span className="icons">
                  <i className="fab fa-instagram"></i>
                  <i className="fab fa-whatsapp"></i>
                </span>
              </p> */}
              {/* <p><strong>Contact:</strong> +1 (999) 999-9999</p> */}
              <p><strong>Email:</strong> {ownerDetails.email || "Loading..."} </p>
            </div>
          </div>
        </div>
        {/* Displaying the reserve status message */}
        {/* {reserveMessage && <p className="reserve-message">{reserveMessage}</p>} */}
        {reservedBy ? (
          <p className="reserved-by">Reserved by: {reservedBy}</p>
        ) : (
          <button className="reserve-button" onClick={handleReserve}>
            Reserve for ${item.price}
          </button>
        )}

      </div>
    </div>
  );
}

export default ItemDetailPage;
