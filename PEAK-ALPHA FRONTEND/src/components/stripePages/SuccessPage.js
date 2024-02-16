import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAtlassian } from '@fortawesome/free-brands-svg-icons';
import "./successPage.css";



function SuccessPage() {
  const navigate = useNavigate();
  const { session_id } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);

  console.log(session_id);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getBookingDetails/${session_id}`);
        setBookingDetails(response.data);
      } catch (error) {
        console.log('Error fetching booking details:', error);
      }
    };

    fetchBookingDetails();
  }, [session_id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleDownloadInvoice = () => {
    // Add logic to download the invoice here 
  };

  return (
    <div className='successPage'>
      <div className="navbar">
        <div className="left-section">
          <button className="backbtn" onClick={handleBack}>
            Back
          </button>
          <h1>
            PEAK
            <FontAwesomeIcon icon={faAtlassian} style={{ color: '#132e35' }} />
            LPHA
          </h1>
        </div>
      </div>
      <div className="booking-details">
        {bookingDetails && (
          <>
            <h2>Booking Details</h2>
            <p>Product: {bookingDetails.product}</p>
            <p>Price: {bookingDetails.price}</p>
            <p>Quantity: {bookingDetails.quantity}</p>
            <button onClick={handleDownloadInvoice}>Download Invoice</button>
          </>
        )}
      </div>
    </div>
  );
}

export default SuccessPage;
