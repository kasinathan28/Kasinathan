import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAtlassian } from "@fortawesome/free-brands-svg-icons";
import Confetti from "react-confetti";
import success from "../../assets/success page.svg";
import "./successPage.css";
import DownloadLoader from "../downloadLoader/downloadLoader";

function SuccessPage() {
  const { session_id } = useParams();
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [loading, setLoading] = useState(false); // State variable for loading animation
  const navigate = useNavigate();

  const profileId = localStorage.getItem("prodileId");
  const productId = localStorage.getItem("productId");

  useEffect(() => {
    const getIntent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getBookingDetails/${session_id}`);
        setPaymentIntent(response.data);
        // Send email using response.data directly
        try {
          setLoading(true); // Set loading state to true
          const emailResponse = await axios.post(`http://localhost:5000/createInvoice/${response.data}`);
          console.log("Email sent successfully:", emailResponse);
          setLoading(false); // Set loading state to false after receiving response
        } catch (error) {
          console.log("Error sending email", error);
          setLoading(false); // Set loading state to false in case of error
        }
      } catch (error) {
        console.log("Error fetching the Payment intent", error);
      }
    };
    getIntent();
  }, [session_id]);

  const handleBack = () => {
    window.history.back(); // Go back to the previous page
  };

  const handleHome = async () => {
    try {
      console.log("In try for storing new booking data");
      console.log(productId);
      const newBooking = await axios.post(`http://localhost:5000/newBooking`, {
        productId: productId,
        profileId: profileId,
        paymentIntentId: paymentIntent,
      });
      navigate(-4);
      console.log(newBooking.data);
    } catch (error) {
      console.log("Error storing booking details", error);
    }
  };

  return (
    <div className="successPage">
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

      <div className="booking-details">
        <div className="thanks">
          <img className="thanks-svg" src={success} alt="success svg" />
        </div>
        <div className="desc">
          <h1>Thanks for your order.</h1>
          <div className="desc2">
            <p>You will get an order confirmation mail soon with the order details. And you can download the Invoice.</p>
          </div>
        </div>
        {!loading && (
          <>
            <button className="invc-btn" onClick={handleHome}>
              Go Home
            </button>
            <Confetti />
          </>
        )}
        {loading && <DownloadLoader />}
      </div>
    </div>
  );
}

export default SuccessPage;
