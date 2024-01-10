// Products.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./products.css";

function Products({ selectedBrands, selectedPrices, products }) {
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/getAllProducts1"
        );

        let allProducts = response.data.products;

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

        setFilteredProducts(allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [selectedBrands, selectedPrices]);

  const handleViewClick = (productId) => {
    console.log(`View product with ID: ${productId}`);
    // Implement your logic for "View" button click
  };

  const handleAddToCartClick = (productId) => {
    console.log(`Add product with ID: ${productId} to cart`);
    // Implement your logic for "Add to Cart" button click
  };

  return (
    <div className="display-container">
      <div className="product-grid">
        {products(filteredProducts).map((product) => (
          <div key={product._id} className="product-card">
            <div>
              <img src={product.image} alt={product.name} />
            </div>
            <h3>{product.name}</h3>
            <h5>{product.brand}</h5>
            <p>Quantity: {product.quantity}</p>
            <p>{product.description}</p>
            <p className="price">${product.price}</p>
            <div className="product-button">
              <button onClick={() => handleViewClick(product._id)}>View</button>
              <button onClick={() => handleAddToCartClick(product._id)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
