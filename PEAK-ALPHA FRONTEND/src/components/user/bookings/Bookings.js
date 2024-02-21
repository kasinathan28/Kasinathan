import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Bookings.css";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Bookings() {
  const profileId = useParams();
  const [bookings, setBookings] = useState([]);
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const [selectedBooking, setSelectedBooking] = useState(null); // State to store selected booking for cancellation

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/getUserBookings/${profileId.profileId}`
        );
        const bookingData = response.data;

        if (bookingData.length === 0) {
          console.log("No bookings found");
          return;
        }

        const bookingsWithProducts = await Promise.all(
          bookingData.map(async (booking) => {
            try {
              const productResponse = await axios.get(
                `http://localhost:5000/getProductDetails/${booking.productId}`
              );
              const productDetails = productResponse.data.product;
              return { ...booking, productDetails };
            } catch (error) {
              console.log(
                "Error fetching the product details for booking:",
                error
              );
              return { ...booking, productDetails: null };
            }
          })
        );

        setBookings(bookingsWithProducts);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [profileId]);

  const handleCancellation = async (paymentIntentId) => {
    // Show the popup when cancellation button is clicked
    setShowPopup(true);
    setSelectedBooking({ paymentIntentId });
  };

  const submitCancellation = async (reason) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/newCancellation/${profileId.profileId}`,
        {
          paymentIntentId: selectedBooking.paymentIntentId,
          reason: reason, 
        }
      );
      toast.success("Cancellation request added successfully");
      setShowPopup(false); // Close the popup after submission
    } catch (error) {
      console.log("Error adding new cancellation", error);
      toast.error("Failed to add cancellation request");
    }
  };

  return (
    <div className="bookingPage">
      <h1>Bookings Page</h1>
      <div className="bookingCard-container">
        {bookings.map((booking, index) => (
          <div key={index} className="bookingCard">
            {booking.productDetails ? (
              <div>
                <h3>Product Details:</h3>
                <p>Name: {booking.productDetails.name}</p>
                <p>Description: {booking.productDetails.description}</p>
                {booking.productDetails.image && (
                  <img
                    src={booking.productDetails.image}
                    alt={booking.productDetails.name}
                  />
                )}
                <div>
                  <button
                    onClick={() =>
                      handleCancellation(booking.paymentIntentId)
                    }
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p>No product details found for this booking</p>
            )}
          </div>
        ))}
      </div>

      {/* Popup/Modal for cancellation reason input */}
      {showPopup && (
        <div className="Bookingmodal">
          <div className="Bookingmodal-content">
            <span className="close" onClick={() => setShowPopup(false)}>
              &times;
            </span>
            <h2>Enter Cancellation Reason</h2>
            <input
              type="text"
              placeholder="Reason for cancellation"
              onChange={(e) => setSelectedBooking({...selectedBooking, reason: e.target.value})}
            />
            <button onClick={() => submitCancellation(selectedBooking.reason)}>Submit</button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Bookings;
