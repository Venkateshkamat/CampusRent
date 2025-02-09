import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/HomePage.css";
import Navbar from "./Navbar";

const HomePage = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isRatingsOpen, setIsRatingsOpen] = useState(true);
  const [selectedOption, setSelectedOption] = useState("Rent");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [priceRange, setPriceRange] = useState(2000);
  const [rentalProducts, setRentalProducts] = useState([]);
  const [lendProducts, setLendProducts] = useState([]);
  const [username, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [rentalFilter, setRentalFilter] = useState('all');
  const navigate = useNavigate();
  require('dotenv').config();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("No authentication token found. Please log in.");
        return;
      }

      try {
        const response = await fetch(`{process.env.BACKEND_URL}/api/users/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (response.ok) {
          setUserName(result.data.name);
        } else {
          // alert(`Failed to fetch user info: ${result.msg}`);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        // alert("An error occurred while fetching user info.");
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("No authentication token found. Please log in.");
        return;
      }

      try {
        const response = await fetch(`{process.env.BACKEND_URL}/api/users/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (response.ok) {
          // setUserFullName(result.data.name);
        } else {
          alert(`Failed to fetch user info: ${result.msg}`);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        alert("An error occurred while fetching user info.");
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {

    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );
    if (!confirmLogout) return;

    localStorage.removeItem("authToken");
    window.location.href = "./";
  };

  const handleClearFilter = () => {
    setSelectedCategory(null);
    setSelectedRating(null);
    setPriceRange(2000);
  };

  useEffect(() => {
    handleRentalFilter('all');
    const fetchRentalProducts = async (username) => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("authToken"); // Get auth token

        const response = await fetch(`{process.env.BACKEND_URL}/api/items/available/items`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token for userMiddleware
            username
          },
        });

        const result = await response.json();

        if (response.ok) {
          setRentalProducts(result); // Set the rental products dynamically
        } else {
          alert("Failed to fetch rental products.");
        }
      } catch (error) {
        console.error("Error fetching rental products:", error);
        // alert("An error occurred while fetching rental products.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRentalProducts();
  }, [username]);

  useEffect(() => {
    const fetchLendProducts = async (username) => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("authToken"); // Get auth token

        const response = await fetch(`{process.env.BACKEND_URL}/api/items/owned`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token for userMiddleware
            username, // Add username to headers
          },
        });

        const result = await response.json();

        if (response.ok) {
          setLendProducts(result.data); // Set lend products
        } else {
          console.error(`Failed to fetch lent products: ${result.message}`);
        }
      } catch (error) {
        console.error("Error fetching lend products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLendProducts(username);
  }, [username]);

  const handleDelete = async (itemId) => {
    const token = localStorage.getItem("authToken"); // Get authToken for authorization
    if (!token) {
      alert("You must be logged in to delete an item.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your posted item? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`{process.env.BACKEND_URL}/api/items/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token for userMiddleware
        },
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Item deleted successfully: ${result.data._id}`);
        // Remove the deleted item from lendProducts
        setLendProducts((prevLendProducts) =>
          prevLendProducts.filter((item) => item._id !== itemId)
        );
      } else {
        alert(`Failed to delete item: ${result.message}`);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("An error occurred while deleting the item.");
    }
  };

  const handleProductClick = (id) => {
    navigate(`/item-detail/${id}`);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleEdit = (id) => {
    navigate(`/update-lend-item/${id}`);
  }

  // const filteredProducts = getFilteredProducts();
  const getFilteredProducts = () => {
    const minRating = selectedRating ? parseInt(selectedRating.charAt(0)) : 0;
    const products = selectedOption === "Rent" ? rentalProducts : lendProducts;

    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery) ||
        product.brand?.toLowerCase().includes(searchQuery);

      const matchesCategory = selectedCategory
        ? product.category === selectedCategory
        : true;

      const productPrice = Number(product.price);
      const productRating = Number(product.rating || 0);
      const currentDate = new Date();

      const matchesRentalFilter =
        rentalFilter === 'all' ||
        (rentalFilter === 'past' && new Date(product.rent_end) < currentDate) ||
        (rentalFilter === 'current' &&
          new Date(product.rent_start) <= currentDate &&
          new Date(product.rent_end) >= currentDate) ||
        (rentalFilter === 'future' && new Date(product.rent_start) > currentDate)

      return (
        matchesSearch &&
        matchesCategory &&
        productPrice <= priceRange &&
        productRating >= minRating &&
        matchesRentalFilter
      );
    });
  };



  const filteredProducts = getFilteredProducts();

  const handleRentalFilter = async (filter) => {
    setRentalFilter(filter);
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      let endpoint = '';
      switch (filter) {
        case 'past':
          endpoint = '{process.env.BACKEND_URL}/api/items/rent/past';
          break;
        case 'current':
          endpoint = '{process.env.BACKEND_URL}/api/items/rent/current';
          break;
        case 'future':
          endpoint = '{process.env.BACKEND_URL}/api/items/rent/future';
          break;
        default:
          endpoint = '{process.env.BACKEND_URL}/api/items/available/items';
      }
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setRentalProducts(result.data || result);
      } else {
        alert(`Failed to fetch ${filter} rental products.`);
      }
    } catch (error) {
      console.error(`Error fetching ${filter} rental products:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-container">
      <Navbar handleLogout={handleLogout} onSearch={handleSearch} />
      <div className="content">
        <aside className="filters">
          <div className="filter-section">
            <div className="filter-header">
              <span>Filters</span>
              <button className="clear-button" onClick={handleClearFilter}>
                CLEAR ALL
              </button>
            </div>

            <div className="filter-price">
              <span>PRICE</span>
              <div className="price-range">
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                />
                <div className="price-labels">
                  <span>$0</span>
                  <span>$2,000</span>
                </div>
                <div className="selected-price">
                  Selected Price: ${priceRange}
                </div>
              </div>
            </div>

            <div className="filter-category">
              <div
                className="dropdown-header"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              >
                <span>CATEGORY</span>
                <span>{isCategoryOpen ? "▲" : "▼"}</span>
              </div>
              {isCategoryOpen && (
                <ul>
                  {["Electronics", "Books", "Furniture", "Clothes", "Footwear", "Vehicle", "Accessories"].map(
                    (category) => (
                      <li key={category}>
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                        />
                        {category}
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>

            <div className="filter-ratings">
              <div
                className="dropdown-header"
                onClick={() => setIsRatingsOpen(!isRatingsOpen)}
              >
                <span>RATINGS</span>
                <span>{isRatingsOpen ? "▲" : "▼"}</span>
              </div>
              {isRatingsOpen && (
                <ul>
                  {["4★ & above", "3★ & above", "2★ & above", "1★ & above"].map(
                    (rating) => (
                      <li key={rating}>
                        <input
                          type="radio"
                          name="rating"
                          checked={selectedRating === rating}
                          onChange={() => setSelectedRating(rating)}
                        />
                        {rating}
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>

            {selectedOption === "Looking to Lend?" && (<button className="lend-button" onClick={() => navigate("/new-lend-item")}>
              Lend New Item
            </button>)}
          </div>
        </aside>

        <main className="main-content">
          <div className="toggle-bar">
            <button
              className={`toggle-option ${selectedOption === "Rent" ? "active" : ""
                }`}
              onClick={() => setSelectedOption("Rent")}
            >
              Rent
            </button>
            <button
              className={`toggle-option ${selectedOption === "Looking to Lend?" ? "active" : ""
                }`}
              onClick={() => setSelectedOption("Looking to Lend?")}
            >
              Looking to Lend?
            </button>
          </div>



          <div className="avail-filter">
            {selectedOption === "Rent" && (
              <>
                <button onClick={() => handleRentalFilter('past')}>Past</button>
                <button onClick={() => handleRentalFilter('current')}>Current</button>
                <button onClick={() => handleRentalFilter('future')}>Future</button>
                <button onClick={() => handleRentalFilter('all')}>All</button>
              </>
            )}

            {selectedOption === "Looking to Lend?" && (
              <>
                <button onClick={() => handleRentalFilter('past')}>Past</button>
                <button onClick={() => handleRentalFilter('current')}>Current</button>
                <button onClick={() => handleRentalFilter('future')}>Future</button>
                <button onClick={() => handleRentalFilter('all')}>All</button>
              </>
            )}
          </div>
          <div className="product-grid">

            {isLoading ? (
              <p>Loading products...</p>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id || product._id}
                  className="product-card"
                  onClick={
                    selectedOption === "Rent"
                      ? () => handleProductClick(product.id || product._id)
                      : undefined
                  }
                >
                  <div className="product-image-container">
                    <img
                      src={product.image || "https://via.placeholder.com/150"}
                      alt={product.name}
                      className="product-image"
                    />
                    <div className="product-status">{product.status}</div>
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-brand">{product.category || "{category}"}</p>
                    <p className="product-description">{product.description}</p>
                    <p className="product-description">{product.status}</p>
                    <div className="product-footer">
                      <span className="product-price">${product.price}</span>
                      <span className="product-rating">{product.rating || "N/A"} ★</span>
                    </div>
                  </div>
                  <div className="product-actions">
                    {selectedOption === "Looking to Lend?" && (
                      <>
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(product.id || product._id)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(product.id || product._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No products match the selected filters.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;