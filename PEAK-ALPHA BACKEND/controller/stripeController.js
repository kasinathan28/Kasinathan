const Product = require("../models/products");




// Making purchase in the stripe
// Making purchase in the stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.makePurchase = async (req, res) => {
  const { productId } = req.params;
  const { priceId, shippingDetails } = req.body;
  const { fullName, address, phoneNumber, state, zip } = shippingDetails;

  try {
    // Create a Checkout session on Stripe
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ['IN'], // Set to India for INR transactions
      },
      success_url: "http://localhost:3000/Success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5000/productDetails/:profileId/:productId",
    });

    // Store session ID if needed
    const storedSessionId = session.id;
    console.log("Stored Session ID:", storedSessionId);
    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.log("Error making purchase:", error);
    res.status(500).json({ error: "Failed to make purchase" });
  }
};
