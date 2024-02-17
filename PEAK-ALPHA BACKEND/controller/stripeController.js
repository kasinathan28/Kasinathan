const Product = require("../models/products");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Making purchase in the stripe
exports.makePurchase = async (req, res) => {
  const { productId } = req.params;
  const { priceId, shippingDetails } = req.body;
  const { fullName, address, phoneNumber, state, zip, country } =
    shippingDetails;

  try {
    // Define allowed countries for shipping
    const allowedCountries = ["US", "CA", "GB", "AU", "IN"];

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
      success_url: "http://localhost:3000/success{CHECKOUT_SESSION_ID}",
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
  const session_id = req.params;
  // const demoId  = req.params;
  console.log("session ID:", session_id.session_id);

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id.session_id);
    console.log(session);
    res.status(200).json(session);
  } catch (error) {
    console.error("Error retrieving Stripe session details:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve Stripe session details" });
  }
};



// Download invoice for a session
exports.downloadInvoice = async (req, res) => {
  console.log("params:",req.params);
  const demoId  = req.params;
  const sessionId = demoId.session_id;
  console.log(sessionId);

  try {
    // Retrieve the Checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if the session is paid and has an invoice
    if (session.payment_status !== "paid" || !session.invoice) {
      return res.status(404).json({ error: "No invoice found for this session" });
    }

    // Retrieve the invoice ID from the session
    const invoiceId = session.invoice;

    // Download the invoice PDF
    const invoicePdf = await stripe.invoices.retrievePdf(invoiceId);

    // Set response headers for the PDF
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice_${invoiceId}.pdf`,
    });

    // Send the PDF data as response
    res.send(invoicePdf);
  } catch (error) {
    console.error("Error downloading invoice:", error);
    res.status(500).json({ error: "Failed to download invoice" });
  }
};


// Create invoice
// Create an invoice with a payment intent ID
exports.createInvoiceWithPaymentIntent = async (req, res) => {
  console.log(req.params);
  const  demoId  = req.params;
  const paymentIntentId =demoId.payment_intent;
  console.log(paymentIntentId);
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Extract customer information from payment intent's shipping details
    const { name, address } = paymentIntent.shipping;

    // Retrieve the customer's ID from the payment intent
    const customerId = paymentIntent.customer;

    // Create an invoice for the customer
    const invoice = await stripe.invoices.create({
      customer: customerId,
      description: 'Invoice for the successful payment intent',
      auto_advance: false,
    });

    // Set the shipping address for the customer
    await stripe.customers.update(customerId, {
      shipping: {
        name,
        address: {
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          postal_code: address.postal_code,
          country: address.country,
        },
      },
    });

    res.status(200).json({ message: 'Invoice created successfully', invoice });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
};



// // Create an invoice with a payment intent ID
// exports.createInvoiceWithPaymentIntent = async (req, res) => {
 
//   try {
//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

//     // Extract customer information from payment intent's shipping details
//     const { name, address } = paymentIntent.shipping;

//     // Create an invoice for the customer
//     const invoice = await stripe.invoices.create({
//       customer: paymentIntent.customer,
//       description: 'Invoice for the successful payment intent',
//       auto_advance: false,
//       shipping: {
//         name, // Use the name from the shipping details
//         address: {
//           line1: address.line1,
//           line2: address.line2,
//           city: address.city,
//           state: address.state,
//           postal_code: address.postal_code,
//           country: address.country,
//         },
//       },
//     });

//     res.status(200).json({ message: 'Invoice created successfully', invoice });
//   } catch (error) {
//     console.error('Error creating invoice:', error);
//     res.status(500).json({ error: 'Failed to create invoice' });
//   }
// };
