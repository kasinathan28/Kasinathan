import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAtlassian } from "@fortawesome/free-brands-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import "./checkout.css";
import axios from "axios";

export default function CheckoutPage() {
  const [productDetails, setProductDetails] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    pincode: "",
    landmark: "",
    city: "",
    phoneNumber: "",
  });

  const { productId } = useParams();

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/productDetails/${productId}`);
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/getProductDetails/${productId}`
        );

        if (response.data && response.data.product) {
          const { stripeId } = response.data.product;
          setProductDetails(response.data.product);

          const stripeResponse = await axios.get(
            `https://api.stripe.com/v1/products/${stripeId}`,
            {
              headers: {
                Authorization:
                  "Bearer sk_test_51Od4KTSF48OWvv58UGojVhgsx9EAR0yoi4za3ocnGYtqNjXaA1PFuIYwFzkz9nyY1Y0CwWSJ3sh1hSDgWcsJFJ2Q003A3cQeTs",
              },
            }
          );

          const stripeProduct = stripeResponse.data;

          if (stripeProduct) {
            setProductDetails((prevDetails) => ({
              ...prevDetails,
              name: stripeProduct.name,
              description: stripeProduct.description,
              bg: stripeProduct.images[0],
            }));
          }
        } else {
          console.error("Invalid or empty response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="checkout-page">
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

      <div className="checkout-content">
        <div className="checkout-pro">
          <div
            className="checkout-card"
            style={{
              backgroundImage: `url(${productDetails.bg})`,
              backgroundSize: "cover",
            }}
          >
            <div className="checkout-details">

            <p>Name: {productDetails.name}</p>
            <p>Brand: {productDetails.brand}</p>
            <p>Description: {productDetails.description}</p>
            <p>Price: {productDetails.price}/-</p>
            </div>
          </div>
        </div>

        <div className="address-div">
          <div className="checkout-form">
            <h2>Shipping Address</h2>
            <form onSubmit={handleFormSubmit} className="form-grid">
              <div className="form-row1">
                <label htmlFor="name">Full Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row1">
                <label htmlFor="address">Address:</label>
                <input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row1">
                <label htmlFor="pincode">Pin Code:</label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row1">
                <label htmlFor="landmark">Landmark:</label>
                <input
                  type="text"
                  id="landmark"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row1">
                <label htmlFor="city">City:</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row1">
                <label htmlFor="phoneNumber">Phone Number:</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row1">
                <button type="submit" className="submit-btn">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
