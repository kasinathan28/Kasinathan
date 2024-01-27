require("dotenv").config();

const Admins = require("../models/Admin");
const Users = require("../models/Users");
const Address = require("../models/Address");
const Product = require("../models/products");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Admin login
exports.login = async (req, res) => {
  const { adminUsername, adminPassword } = req.body;

  try {
    const admin = await Admins.findOne({ adminUsername });

    if (!admin || admin.adminPassword !== adminPassword) {
      res.status(401).json({ error: "Invalid admin username or password" });
      return;
    }
    res.status(200).json({ message: "Admin login successful" });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ error: "An error occurred during admin login" });
  }
};



// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'An error occurred while fetching products' });
  }
};


exports.addProduct = async (req, res) => {
  try {
    const { name, brand, description, price, priceId, quantity } = req.body;

    const newProduct = new Product({
      name,
      brand, 
      description,
      price,
      quantity,
      image: `http://localhost:5000/uploads/${req.file.filename}`,
    });

    await newProduct.save();

    // Create product on Stripe
    const stripeProduct = await stripe.products.create({
      name: newProduct.name,
      description: newProduct.description,
    });

    // Create price on Stripe
    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: price * 100, // Stripe uses the amount in cents
      currency: 'inr', 
    });

    newProduct.priceId = stripePrice.id; // Update the priceId field in your Product model
    await newProduct.save();

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      error: "An error occurred while adding the product",
    });
  }
};




// Update Product by ID
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { name, brand, description, price, priceId, quantity } = req.body;

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    existingProduct.name = name;
    existingProduct.brand = brand; 
    existingProduct.description = description;
    existingProduct.price = price;
    existingProduct.priceId = priceId;
    existingProduct.quantity = quantity;

    // Save the updated product
    await existingProduct.save();

    res.status(200).json({
      message: "Product updated successfully",
      product: existingProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      error: "An error occurred while updating the product",
    });
  }
};


  // Delete Product by ID
  exports.deleteProduct = async (req, res) => {
    try {
      const productId = req.params.productId;

      // Check if the product exists
      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Delete the product
      await Product.findByIdAndDelete(productId);

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "An error occurred while deleting the product" });
    }
  };

  // API for fetching all the users in the database.
  exports.getUsers = async (req, res) => {
    try {
      console.log('Fetching users...');
    
      // Use the `populate` method to include the corresponding address data
      const users = await Users.find().populate('addressId');
      console.log('Users fetched successfully:', users);
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };