import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAtlassian } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';
import './productsDetails.css';
import Loader from '../../loader/Loader';

function ProductDetails() {
  const [productDetails, setProductDetails] = useState({});
  const [imageLoaded, setImageLoaded] = useState(false); // State to track image loading
  const { productId } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleBuy = () => {
    navigate(`/checkout/${productId}`);
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getProductDetails/${productId}`);

        if (response.data && response.data.product) {
          const { stripeId } = response.data.product;

          const stripeResponse = await axios.get(`https://api.stripe.com/v1/products/${stripeId}`, {
            headers: {
              'Authorization': 'Bearer sk_test_51Od4KTSF48OWvv58UGojVhgsx9EAR0yoi4za3ocnGYtqNjXaA1PFuIYwFzkz9nyY1Y0CwWSJ3sh1hSDgWcsJFJ2Q003A3cQeTs',
            },
          });

          const stripeProduct = stripeResponse.data;

          setProductDetails({
            ...response.data.product,
            name: stripeProduct.name,
            description: stripeProduct.description,
            bg: stripeProduct.images[0],
          });

          setImageLoaded(true); // Set imageLoaded to true after setting product details
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
          {!imageLoaded && <Loader />} {/* Render the Loader component until the image is loaded */}
          <img
            src={productDetails.bg}
            alt={productDetails.name}
            style={{ display: imageLoaded ? 'block' : 'none' }} // Hide the image until it's loaded
          />
        </div>
        {imageLoaded && ( // Render page content after image is loaded
          <>
            <div className="heading">
              <h1>Preview</h1>
            </div>
            <div className="product-card1">
              <img src={productDetails.image} alt={productDetails.name} />
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
    </div>
  );
}

export default ProductDetails;
