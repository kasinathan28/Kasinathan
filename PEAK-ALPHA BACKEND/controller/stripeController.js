const Product = require("../models/products");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);



// Making purchase in the stripe
exports.makePurchase = async (req, res) => {
  const { productId } = req.params;
  const { priceId, shippingDetails } = req.body;
  const { fullName, address, phoneNumber, state, zip, country } = shippingDetails;

  try {
    // Define allowed countries for shipping
    const allowedCountries =  ['US', 'CA', 'GB', 'AU', 'IN'] ;

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
        allowed_countries: allowedCountries,
      },
      success_url: "http://localhost:3000/{CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000",
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


// Get details with the session id
exports.getBookignDetails = async (req, res) => {
    const { sessionId } = req.params;
    console.log(sessionId);
  
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      res.json(session);
    } catch (error) {
      console.error('Error retrieving Stripe session details:', error);
      res.status(500).json({ error: 'Failed to retrieve Stripe session details' });
    }
  };
