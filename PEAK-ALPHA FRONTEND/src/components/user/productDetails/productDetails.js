import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAtlassian } from '@fortawesome/free-brands-svg-icons';
import './productsDetails.css';
import LoaderMain from '../../loadermain/LoaderMain';
import ShippingPopUp from '../shippingAddresspopup/ShippingPopUp';
import {loadStripe} from '@stripe/stripe-js';



function ProductDetails() {
  const { profileId, productId } = useParams();
  const [productDetails, setProductDetails] = useState({});
  const [imageLoaded, setImageLoaded] = useState(false); 
  const [showShippingPopup, setShowShippingPopup] = useState(false); 

  const navigate = useNavigate();

  // Handle back 
  const handleBack = () => {
    navigate(`/dashboard/${profileId}`);
  };

  // to show the shipping address popup 
  const handleBuy = () => {
    setShowShippingPopup(true); 
  };

  // Fetch the product details from the database and the stripe
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getProductDetails/${productId}`);

        if (response.data && response.data.product) {
          const { stripeId } = response.data.product;

          const stripeResponse = await axios.get(`https://api.stripe.com/v1/products/${stripeId}`, {
            headers: {
              'Authorization': 'Bearer sk_test_51Ojlv2SHpAQ54psvuBo0ftWrIczsL7q8qGynsO2CXvazJ0eBVzXaO0lXP6GZm64vYt0BlTjhhhSgSo097jEOxVCd005HDV2jpK',
            },
          });

          const stripeProduct = stripeResponse.data;

          setProductDetails({
            ...response.data.product,
            name: stripeProduct.name,
            description: stripeProduct.description,
            bg: stripeProduct.images[0],
          });

          setImageLoaded(true); 
        } else {
          console.error('Invalid or empty response:', response.data);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  return (
    <div className="details">
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
      <div className="main">
        <div className="background">
          {!imageLoaded && <LoaderMain />} 
          <img
            src={productDetails.bg}
            alt={productDetails.name}
            style={{ display: imageLoaded ? 'block' : 'none' }} 
          />
        </div>
        {imageLoaded && ( 
          <>
            <div className="heading">
              <h1>Preview</h1>
            </div>
            <div className="product-card1">
              <p>Name: {productDetails.name}</p>
              <p>Description: {productDetails.description}</p>
              <p>Price: ₹{productDetails.price}</p>
              <div>
                <button className="buy-btn" onClick={handleBuy}>
                  Buy Now
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      {showShippingPopup && <ShippingPopUp onClose={() => setShowShippingPopup(false)} />}
    </div>
  );
}

export default ProductDetails;
