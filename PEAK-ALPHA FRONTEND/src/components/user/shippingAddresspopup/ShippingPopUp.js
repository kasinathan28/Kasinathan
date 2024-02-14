import React, { useState, useEffect } from "react";
import "./shippingPopup.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {loadStripe} from '@stripe/stripe-js';

function ShippingPopUp({ onClose }) {
  const { productId } = useParams();

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phoneNumber:"",
    state: "",
    zip: "",
  });

  const [stripeProductId, setStripeProductId] = useState("");
  const [priceId, setPriceId ] = useState();
  const [paymentUrl, setPaymentUrl] = useState();

  const navigate = useNavigate();


  useEffect(() => {
    // Fetch the Stripe ID for the given product ID
    const fetchStripeProductId = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getProductDetails/${productId}`);
        setStripeProductId(response.data.product.stripeId);
        console.log(stripeProductId);
        setPriceId(response.data.product.priceId);
      } catch (error) {
        console.log("Error fetching product details:", error);
      }
    };

    fetchStripeProductId();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const stripe = await loadStripe("pk_test_51Od4KTSF48OWvv58PYdeaQGDxJoU8F9eA9JemFbaj5e01QWgQeYhjXAHiPJqhtAZKiMOnud8LZzHk1OG4iJKdv7800Ya6P5ZvF");

    const deliveryData = {
      fullName: formData.fullName,
      address: formData.address,
      zipCode: formData.zip,
      phoneNumber:formData.phoneNumber,
      state: formData.state,
    };
  
    console.log(priceId);
  
    if (deliveryData.fullName) {
      // Make an API request to make the purchase
      try {
        const response = await axios.post(`http://localhost:5000/purchase/${productId}`, {
          priceId: priceId,
          shippingDetails: deliveryData,
        });
  
        console.log("Purchase successful:", response.data);
        
        // Set the payment URL state
        setPaymentUrl(response.data.url);
        
        window.location.href = response.data.url;
      } catch (error) {
        console.error("Error making purchase:", error);
      }
    } else {
      alert("Please fill in all required fields.");
      console.log("missing delivery Data", deliveryData);
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
          <label htmlFor="phoneNumber">Phone :</label>
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
