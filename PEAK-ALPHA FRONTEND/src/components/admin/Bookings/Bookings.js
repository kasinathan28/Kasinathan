import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Booking.css';
import { useParams } from 'react-router-dom';

function Bookings() {
  const [bookings, setBookings] = useState([]);

  const handleViewDetails = (booking) => {
    console.log("View button clicked for booking:", booking);
    // Here, you have access to the details of the clicked booking object
  }

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getBookings`);
        const bookingData = response.data;

        if (bookingData.length === 0) {
          console.log('No bookings found');
          return;
        }

        const bookingsWithProducts = await Promise.all(
          bookingData.map(async booking => {
            try {
              const productResponse = await axios.get(`http://localhost:5000/getProductDetails/${booking.productId}`);
              const productDetails = productResponse.data.product;
              return { ...booking, productDetails };
            } catch (error) {
              console.log("Error fetching the product details for booking:", error);
              return { ...booking, productDetails: null };
            }
          })
        );

        setBookings(bookingsWithProducts);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className='admin'>
      <div className='bookingPage'>
        <h1>Bookings Page</h1>
        <div className='bookingCard-container'>
          {bookings.map((booking, index) => (
            <div key={index} className='bookingCard'>
              {booking.productDetails ? (
                <div>
                  <h3>Product Details:</h3>
                  <p>Name: {booking.productDetails.name}</p>
                  <p>Description: {booking.productDetails.description}</p>
                  {booking.productDetails.image && (
                    <img src={booking.productDetails.image} alt={booking.productDetails.name} />
                  )}
                </div>
              ) : (
                <p>No product details found for this booking</p>
              )}
              <button onClick={() => handleViewDetails(booking)}>View Details</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Bookings;
