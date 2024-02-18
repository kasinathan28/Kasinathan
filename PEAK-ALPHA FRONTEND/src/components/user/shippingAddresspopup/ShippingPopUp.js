import React, { useState, useEffect } from "react";
import axios from "axios";
import { loadStripe } from '@stripe/stripe-js';
import "./shippingPopup.css";
import { useParams } from "react-router-dom";

function ShippingPopUp({ onClose }) {
  const { productId, profileId } = useParams();
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
    state: "",
    zip: "",
    country: "US", // Set the country outside India, for example, "US"
  });
  const [priceId, setPriceId] = useState();
  const [paymentUrl, setPaymentUrl] = useState();

  localStorage.setItem("prodileId", profileId);
  localStorage.setItem("productId", productId);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getProductDetails/${productId}`);
        setPriceId(response.data.product.priceId);
      } catch (error) {
        console.log("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const stripe = await loadStripe("pk_test_51Ojlv2SHpAQ54psvKPbEvnq7k46Qa9q3E2C4ABtlRNgPYAO7Y6VYVPABirMGvsfyav8pGPQD5r1b3haqdY2zIgUS00zPfoGDqj");

    const deliveryData = {
      fullName: formData.fullName,
      address: formData.address,
      phoneNumber: formData.phoneNumber,
      state: formData.state,
      zip: formData.zip,
      country: formData.country, 
    };

    if (deliveryData.fullName) {
      try {
        const response = await axios.post(`http://localhost:5000/purchase/${productId}`, {
          priceId: priceId,
          shippingDetails: deliveryData,
          profileId:profileId,
        });

        setPaymentUrl(response.data.url);
        const { data: { sessionId } } = response;

        // Redirect to Checkout session URL
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error("Error redirecting to Checkout:", error);
        }
      } catch (error) {
        console.error("Error making purchase:", error);
      }
    } else {
      alert("Please fill in all required fields.");
    }
  };

  
  return (
    <div className="shipping-popup">
      <button className="close-btn" onClick={onClose}>
        X
      </button>
      <h1>Shipping Address</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone:</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="state">State:</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="zip">ZIP Code:</label>
          <input
            type="text"
            id="zip"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ShippingPopUp;
