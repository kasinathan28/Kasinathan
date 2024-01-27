import React, { useState, useEffect } from "react";
import axios from "axios";
import "./cart.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAtlassian } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";

// Styling for the card
const CartItemCard = ({ productDetail, item }) => (
  <div className="cart-item-card">
    <img src={productDetail.image} alt={productDetail.name} />
    <div className="card-details">
      <p className="product-name">{productDetail.name}</p>
      <p className="product-price">Price: ₹{productDetail.price}</p>
      <p className="product-quantity">Quantity: {item.quantity}</p>
      <div className="card-body">
        <button>Buy Now</button>
      </div>
    </div>
  </div>
);

export default function Cart() {
  const [userCart, setUserCart] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    const fetchUserCart = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getCart", {
          params: { username: username },
        });

        setUserCart(response.data.cart);
      } catch (error) {
        console.error("Error fetching user's cart:", error);
      }
    };

    fetchUserCart();
  }, [username]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productIds = userCart.map((item) => item.product);
        const response = await axios.post("http://localhost:5000/getProductDetails", {
          productIds: productIds,
        });

        setProductDetails(response.data.productDetails);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    if (userCart.length > 0) {
      fetchProductDetails();
    }
  }, [userCart]);

  return (
    <div className="cart">
      <div className="navbar">
        <div className="left-section">
          <button className="backbtn" onClick={handleBack}>
            Back
          </button>
          <h1>
            PEAK
            <FontAwesomeIcon icon={faAtlassian} style={{ color: "#132e35" }} />
            LPHA
          </h1>
        </div>
      </div>

      <div className="main">
        <div className="heading">
          <h1>Your cart</h1>
        </div>
        <div className="bar" />

        {/* Display the user's cart items with product details in card format */}
        <div className="cart-items">
          {userCart.map((item) => {
            const productDetail = productDetails.find((product) => product._id === item.product);
            return (
              <div key={item._id} className="cart-item">
                {productDetail && (
                  <CartItemCard productDetail={productDetail} item={item} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
