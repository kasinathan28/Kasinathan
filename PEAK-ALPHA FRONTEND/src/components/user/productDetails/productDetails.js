import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAtlassian } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import "./productsDetails.css";

function ProductDetails() {
  const [productDetails, setProductDetails] = useState({});
  const { productId, stripeProductId } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/dashboard");
  }

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        // Fetch product details from your server
        const response = await axios.get(`http://localhost:5000/getProductDetails/${productId}`);

        if (response.data && response.data.product) {
          setProductDetails(response.data.product);

          const priceId = response.data.product.priceId;

          const stripeResponse = await axios.get(`https://api.stripe.com/v1/products`, {
            headers: {
              'Authorization': 'Bearer sk_test_51Od4KTSF48OWvv58UGojVhgsx9EAR0yoi4za3ocnGYtqNjXaA1PFuIYwFzkz9nyY1Y0CwWSJ3sh1hSDgWcsJFJ2Q003A3cQeTs',
            },
          });

          const stripeProduct = stripeResponse.data.product;

          if (stripeProduct) {

            setProductDetails((prevDetails) => ({
              ...prevDetails,
              name: stripeProduct.name,
              description: stripeProduct.description,
            }));
          }
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
    <div className='details'>
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
      <div className='main'>
        <div className='heading'>
          <h1>Preview</h1>
        </div>
        <div>
          <img src={productDetails.image} alt={productDetails.name} />
          <p>Name: {productDetails.name}</p>
          <p>Description: {productDetails.description}</p>
          <p>Price: ₹{productDetails.price}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
