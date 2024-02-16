import React, { useState, useEffect } from "react";
import "./products.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    priceId: "",
    brand: "",
    quantity: "",
    stripeId: "",
    image: null,
  });

  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/getAllProducts"
        );
        const filteredProducts = response.data.products.filter((product) =>
          product.name.toLowerCase().includes(filter.toLowerCase())
        );
        setProducts(filteredProducts);
        console.log("Products fetched successfully:", response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [filter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (formMode === "add") {
      handleAddProduct(formData);
    } else if (formMode === "edit") {
      handleUpdateProduct(formData);
    }
  };

  const handleNew = () => {
    setFormMode("add");
    setIsModalOpen(true);
    setSelectedProductId(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      priceId: "",
      brand: "",
      quantity: "",
      image: null,
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: "",
      description: "",
      price: "",
      priceId: "",
      quantity: "",
      brand: "",
      image: null,
    });
  };

  const handleAddProduct = async (productData) => {
    try {
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      formData.append("priceId", productData.priceId);
      formData.append("quantity", productData.quantity);
      formData.append("brand", productData.brand);
      formData.append("image", productData.image);
      formData.append("productId", productData.id);
      formData.append("stripeId", productData.stripeId);

      const response = await axios.post(
        "http://localhost:5000/addnew",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Product added successfully:", response.data);
      window.location.reload();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Frontend code using Axios

  const handleUpdateProduct = async (productData) => {
    console.log(productData);

    try {
      // Update product in MongoDB
      const mongoResponse = await axios.put(
        `http://localhost:5000/updateProduct/${selectedProductId}`,
        productData
      );

      // Update product in Stripe if stripeId is defined
      const { name, description, price, stripeId } = productData;
      if (stripeId) {
        const stripeResponse = await axios.post(
          `http://localhost:5000/updateStripeProduct/${stripeId.toString()}`,
          {
            name,
            description,
            price,
          }
        );
        console.log(
          "Product updated successfully in Stripe:",
          stripeResponse.data
        );
      } else {
        console.log("Stripe ID is undefined. Skipping Stripe update.");
      }

      console.log(
        "Product updated successfully in MongoDB:",
        mongoResponse.data
      );

      window.location.reload();
      setIsModalOpen(false);
      setSelectedProductId(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleEditProduct = (product) => {
    setFormMode("edit");
    setSelectedProductId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      priceId: product.priceId,
      quantity: product.quantity,
      brand: product.brand,
      stripeId: product.stripeId,
      image: null,
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId, stripeId) => {
    console.log(productId);
    try {
       // Delete the product from the local database
       const response = await axios.delete(
        `http://localhost:5000/deleteProduct/${productId}`
     );
     
       console.log("Product deleted successfully:", response.data);
 
       // Update the state to reflect the deletion
       const updatedProducts = products.filter(
          (product) => product._id !== productId
       );
       setProducts(updatedProducts);
    } catch (error) {
       console.log("Error deleting product:", error);
    }
 };
 

  return (
    <div className="products-page">
      <div className="main">
        <div className="card">
          <FontAwesomeIcon icon={faPlus} style={{ fontSize: "52px" }} />
          <button onClick={handleNew}>
            <p>Add new products</p>
          </button>
        </div>
      </div>
      <div className="product-filter">
        <div className="filter">
          <label>Search by Name:</label>
          <input
            type="text"
            value={filter}
            className="searchBar"
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Enter product name"
          />
        </div>
      </div>
      <div className="product-display">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <div className="product-img">
              <img src={product.image} alt={product.image} />
            </div>
            <div>
              <h3>{product.name}</h3>
              <h3>{product.brand}</h3>
              <div>
                <p><strong>{product.description}</strong></p>
              </div>
              <div>
                <p><strong>Stripe ID :</strong>{product.stripeId}</p>
                <p><strong>Price ID:</strong> {product.priceId}</p>
                <p><strong>Price: Rs.</strong>{product.price}</p>
              </div>
              <p><strong>Quantity: </strong>{product.quantity}</p>
              <div className="product-card-button">
                <button
                  className="edit"
                  onClick={() => handleEditProduct(product)}
                >
                  Edit
                </button>
                <button
                  className="delete"
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{formMode === "add" ? "Add New Product" : "Edit Product"}</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="modalform-row">
                <div className="modalform-coloumn">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="modalform-coloumn">
                  <label>Brand:</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="modalform-row">
                <div>
                  <label>Description:</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="modalform-coloumn">
                  <label>Price:</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="modalform-row">
                <div>
                  <label>Price ID:</label>
                  <input
                    type="text"
                    name="priceId"
                    value={formData.priceId}
                    onChange={handleChange}
                  />
                </div>

                <div className="modalform-coloumn">
                  <label>Quantity:</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="modalform-row">
                <div className="modalform-coloumn">
                  <label>Image:</label>
                  <input
                    type="file"
                    name="image"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        image: e.target.files[0],
                      })
                    }
                  />
                </div>
              </div>

              <button type="button" onClick={handleSubmit}>
                {formMode === "add" ? "Add Product" : "Update Product"}
              </button>
              <div>
                <button type="button" onClick={handleCloseModal}>
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
