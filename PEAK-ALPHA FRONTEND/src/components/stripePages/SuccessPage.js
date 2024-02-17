import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAtlassian } from "@fortawesome/free-brands-svg-icons";
import "./successPage.css";
import Confetti from "react-confetti";
import useWindowSize from 'react-use/lib/useWindowSize'


import success from "../../assets/success page.svg";

function SuccessPage() {
  const navigate = useNavigate();
  const { session_id } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [invoice, setInvoice] = useState();

  const { width, height } = useWindowSize()

  console.log(session_id);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/getBookingDetails/${session_id}`
        );
        setBookingDetails(response.data);
        console.log(bookingDetails.amount_total);
      } catch (error) {
        console.log("Error fetching booking details:", error);
      }
    };

    fetchBookingDetails();
  }, [session_id]);

  useEffect(() =>{
    const createInvoice = async ()=>{
      try {
        const invoice = await axios.post(`http://localhost:5000/createInvoice/${bookingDetails.payment_intent}`);
        setInvoice(invoice.data);
        console.log(invoice);
      } catch (error) {
        console.log("Error creating invoice", error);
      }
    };
    createInvoice();
  }, []);
  

  const handleBack = () => {
    navigate(-1);
  };

  const handleDownloadInvoice = () => {};

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
          <Confetti width={width} height={height} numberOfPieces={50} />
          <img className="thanks-svg" src={success} alt="success svg" />
        </div>
        <div className="desc">
          <h1>Thanks for your order.</h1>
          <div className="desc2">
          <p>You will get an order confirmation mail soon with the order details. And you can download the Invoice.</p>
          </div>
        </div>
        {bookingDetails && (
          <>
            <button className="invc-btn" onClick={handleDownloadInvoice}>
              Download Invoice
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default SuccessPage;
