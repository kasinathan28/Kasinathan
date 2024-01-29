// Products.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./products.css";

function Products({ selectedBrands, selectedPrices }) {
  const [filteredProducts, setFilteredProducts] = useState([]);

  const navigate = useNavigate();

  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response1 = await axios.get("http://localhost:5000/getAllProducts1");
  
        if (!response1.data || !Array.isArray(response1.data.products)) {
          console.error("Invalid or empty response:", response1.data);
          return;
        }
  
        let allProducts = response1.data.products;
  

        if (selectedBrands.length > 0) {
          allProducts = allProducts.filter((product) =>
            selectedBrands.includes(product.brand)
          );
        }

        if (selectedPrices.length > 0) {
          allProducts = allProducts.filter((product) =>
            selectedPrices.includes(product.price)
          );
        }

        // Sort products by description
        allProducts.sort((a, b) => a.description.localeCompare(b.description));

        // Fetch additional details from your second API
        const response2 = await axios.get("http://localhost:5000/getAllProducts3");
        // response2.data.products.forEach((product) => {
        //   console.log("Product ID:", product.id);
        //   const stripeIds = response2.data.products.map((product) => product.id);
        //   console.log(stripeIds);
        // });

        
        if (!response2.data || !Array.isArray(response2.data.products)) {
          console.error("Invalid or empty response from Stripe API:", response2.data);
          return;
        }

        const stripeProducts = response2.data.products;

        // Combine the data from both APIs based on a common identifier (e.g., product ID)
        const combinedProducts = allProducts.map((product1) => {
          const matchingStripeProduct = stripeProducts.find((product2) => product2.id === product1.stripeProductId);
          return { ...product1, ...matchingStripeProduct };
        });
  
        setFilteredProducts(combinedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [selectedBrands, selectedPrices]);


 

  const handleViewClick = async (productId) => {
  
      navigate(`/productDetails/${productId}`);
   
  };
  
  
  

  const handleAddToCartClick = async (productId) => {
    try {
      await axios.post("http://localhost:5000/addToCart", {
        username: username,
        product: productId,
      });

      console.log(`Product with ID ${productId} added to the cart for user ${username}`);
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  return (
    <div className="display-container">
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product._id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-details">
              <h3>{product.name}</h3>
              <h5>{product.description}</h5>
              <p>Quantity: {product.quantity}</p>
              <p className="price">₹{product.price}</p>
              <div className="product-button">
              <button onClick={() => handleViewClick(product._id, product.stripeProductId)}>View</button>
                <button onClick={() => handleAddToCartClick(product._id)}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;