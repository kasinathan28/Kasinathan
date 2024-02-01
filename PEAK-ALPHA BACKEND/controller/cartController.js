const Cart = require("../models/Cart");
const Product = require("../models/products");

// End point to add the product to cart.
exports.addToCart = async (req, res) => {
  const { username, product } = req.body;
  try {
   const existingCartItem = await Cart.findOne({ username, product });
    if (existingCartItem) {
      existingCartItem.quantity += 1;
      await existingCartItem.save();
    } else {
      await Cart.create({ username, product, quantity: 1 });
    }
    const updatedCart = await Cart.find({ username }).populate("product");
    res
      .status(200)
      .json({
        message: "Product added to cart successfully",
        cart: updatedCart,
      });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// End point to get the cart items
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


// End point to get the product details.
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