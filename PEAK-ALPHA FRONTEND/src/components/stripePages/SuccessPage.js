import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAtlassian } from "@fortawesome/free-brands-svg-icons";
import Confetti from "react-confetti"; // Import Confetti component

import success from "../../assets/success page.svg";
import "./successPage.css";

function SuccessPage() {
  const navigate = useNavigate();
  const { session_id } = useParams();
  const [paymentIntent, setPaymentIntent] = useState(null);

  useEffect(() => {
    const GetIntent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getBookingDetails/${session_id}`);
        setPaymentIntent(response.data);
        console.log(response.data);
  
        // Send email using response.data directly
        try {
          const emailResponse = await axios.post(`http://localhost:5000/createInvoice/${response.data}`);
          console.log("Email sent successfully:", emailResponse);
        } catch (error) {
          console.log("Error sending email", error);
        }
      } catch (error) {
        console.log("Error fetching the Payment intent", error);
      }
    };
    GetIntent();
  }, []);
  
  
  const handleBack = () => {
    navigate(-1);
  };

  const handleHome =()=>{
    navigate(-4);
    window.location.reload();
  }


  // useEffect(() =>{
  //   const sendEmail = async () => {
  //     console.log(payment_intent);
     
  //   };
  //   sendEmail();
  // }, []);
  

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
        {paymentIntent && (
          <>
            <button className="invc-btn" onClick={handleHome}>
              Go Home
            </button>
            <Confetti /> 
          </>
        )}
      </div>
    </div>
  );
}

export default SuccessPage;
