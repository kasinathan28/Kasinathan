const Cart = require("../models/Cart");
const Product = require("../models/products");


exports.addToCart = async (req, res) => {
    const { username, product } = req.body;
  
    try {
      // Check if the user already has the product in the cart
      const existingCartItem = await Cart.findOne({ username, product });
  
      if (existingCartItem) {
        // If the product is already in the cart, update its quantity
        existingCartItem.quantity += 1;
        await existingCartItem.save();
      } else {
        // If the product is not in the cart, add it with a quantity of 1
        await Cart.create({ username, product, quantity: 1 });
      }
  
      res.status(200).json({ message: "Product added to cart successfully" });
    } catch (error) {
      console.error("Error adding product to cart:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };



  exports.getCart = async (req, res) => {
    const { username } = req.query;
  
    try {
      const userCart = await Cart.find({ username });
  
      res.status(200).json({ cart: userCart });
    } catch (error) {
      console.error("Error fetching user's cart:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


  exports.getProductDetails = async (req, res) => {
    const { productIds } = req.body;
  
    try {
      const productDetails = await Product.find({ _id: { $in: productIds } });
  
      res.status(200).json({ productDetails });
    } catch (error) {
      console.error("Error fetching product details:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };