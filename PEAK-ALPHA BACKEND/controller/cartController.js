const Cart = require("../models/Cart");


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