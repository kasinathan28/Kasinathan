import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAtlassian } from "@fortawesome/free-brands-svg-icons";
import { faShoppingCart, faHome } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "./dashboard.css";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import HamburgerMenu from "react-hamburger-menu";
import ad1 from "../../../assets/corossial 1.png";
import ad2 from "../../../assets/ad2.png";
import ad3 from "../../../assets/ad3.png";
import axios from "axios";
import Products from "../products/Products";

function Dashboard() {
  const demoProfileId = useParams();
  const profileId = demoProfileId.profileId;
  const [isOpen, setIsOpen] = useState(false);
  const images = [ad1, ad2, ad3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const [isSidebarFixed, setIsSidebarFixed] = useState(false);
  const [brands, setBrands] = useState([]);
  const [prices, setPrices] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleBrandChange = (brand) => {
    const updatedBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];

    setSelectedBrands(updatedBrands);
  };

  const handlePriceChange = (price) => {
    const updatedPrices = selectedPrices.includes(price)
      ? selectedPrices.filter((p) => p !== price)
      : [...selectedPrices, price];

    setSelectedPrices(updatedPrices);
  };

  const toggleMenu = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/getAllProducts1"
        );
        const uniqueBrands = [
          ...new Set(response.data.products.map((product) => product.brand)),
        ];
        setBrands(uniqueBrands);

        console.log("Products fetched successfully:", response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const updateImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const renderSlideIndicators = () => {
    return images.map((_, index) => (
      <div
        key={index}
        className={`slide-indicator ${
          index === currentImageIndex ? "active" : ""
        }`}
        onClick={() => setCurrentImageIndex(index)}
      />
    ));
  };

  const handleProfile = () => {
    navigate(`/profile/${profileId}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setIsSidebarFixed(scrollTop >= 120);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const filterProducts = (products) => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleCart = () => {
    navigate(`/cart/${profileId}`);
  };

  return (
    <div className={`user-dash ${isOpen ? "expanded" : ""}`}>
      <div className={`navbar ${isOpen ? "navbar-expanded" : ""}`}>
        <div className="left-section">
          <h1>
            PEAK
            <FontAwesomeIcon
              icon={faAtlassian}
              className="logo1"
              style={{ color: "#b9b5e2" }}
            />
            LPHA
          </h1>
        </div>
        <div
          className={`right-section ${isOpen ? "right-section-expanded" : ""}`}
        >
          <div className="home-button">
            <FontAwesomeIcon icon={faHome} style={{ color: "#b9b5e2" }} />
            HOME
          </div>
          <div className="cart-button" onClick={handleCart}>
            <FontAwesomeIcon
              icon={faShoppingCart}
              style={{ color: "#b9b5e2" }}
            />
            CART
          </div>
          <div>
            <input
              type="text"
              placeholder="Search..."
              className="searchBar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="hamburger-menu">
            <HamburgerMenu
              isOpen={isOpen}
              menuClicked={toggleMenu}
              width={30}
              height={20}
              strokeWidth={3}
              rotate={0}
              color="#b9b5e2"
              borderRadius={0}
              animationDuration={0.5}
            />
            {isOpen && (
              <div className="dropdown-menu hamburger-dropdown">
                <ul>
                  <li onClick={handleProfile}>
                    <FontAwesomeIcon icon={faUser} />
                    PROFILE
                  </li>
                  <li onClick={handleLogout}>
                    <FontAwesomeIcon icon={faShoppingCart} />
                    LOGOUT
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="banner">
        <div className="slide-indicators-container">
          {renderSlideIndicators()}
        </div>
        <img
          src={images[currentImageIndex]}
          alt={`Image ${currentImageIndex + 1}`}
        />
      </div>

      <div className="sidebar-and-content">
        <div className={`sidebar ${isSidebarFixed ? "fixed" : ""}`}>
          <div className="filters">
            <h2>Filters</h2>
            <div className="brand">
              <h3>Brands</h3>
              <ul className="userul">
                {brands.map((brand) => (
                  <li key={brand}>
                    <strong>{brand}</strong>
                    <input
                      type="checkbox"
                      name="brand"
                      value={brand}
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="display-container">
          <Products
            selectedBrands={selectedBrands}
            selectedPrices={selectedPrices}
            products={filterProducts}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
