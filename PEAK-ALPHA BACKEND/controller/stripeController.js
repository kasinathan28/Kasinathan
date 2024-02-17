const Product = require("../models/products");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const pdf = require('html-pdf');
const fs = require('fs');

// Making purchase in the stripe
exports.makePurchase = async (req, res) => {
  const { productId } = req.params;
  const { priceId, shippingDetails } = req.body;
  const { fullName, address, phoneNumber, state, zip, country } = shippingDetails;

  try {
    // Define allowed countries for shipping
    const allowedCountries = ["US", "CA", "GB", "AU", "IN"];

    // Create a new Stripe customer
    const customer = await stripe.customers.create({
      name: fullName,
      address: {
        line1: address,
        city: state,
        postal_code: zip,
        country: country,
      },
      phone: phoneNumber,
    });

    // Create a Checkout session on Stripe
    const session = await stripe.checkout.sessions.create({
      customer: customer.id, // Assign customer to the session
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
      success_url: "http://localhost:3000/success/{CHECKOUT_SESSION_ID}",
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
    const session = await stripe.checkout.sessions.retrieve(
      session_id.session_id
    );
    console.log(session);
    res.status(200).json(session);
  } catch (error) {
    console.error("Error retrieving Stripe session details:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve Stripe session details" });
  }
};

exports.sendReceiptByEmail = async (req, res) => {
  try {
    const { paymentIntentId, recipientEmail } = req.body;

    // Retrieve payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Ensure payment intent contains valid customer information
    const customerId = paymentIntent.customer;
    if (!customerId) {
      throw new Error("Payment intent does not contain a valid customer ID");
    }

    // Construct HTML content for the receipt
    const htmlContent = `
      <html>
        <head>
          <title>Receipt</title>
        </head>
        <body>
          <h1>Receipt for Your Payment</h1>
          <p>Thank you for your payment. Here is your receipt for the recent purchase:</p>
          <p>Amount: ${paymentIntent.amount} ${paymentIntent.currency.toUpperCase()}</p>
          <p>Payment Method: ${paymentIntent.payment_method_details.card.brand} ending in ${paymentIntent.payment_method_details.card.last4}</p>
          <!-- Add more receipt details here as needed -->
        </body>
      </html>
    `;

    // Generate PDF from HTML content
    pdf.create(htmlContent).toBuffer(async (err, buffer) => {
      if (err) {
        console.error("Error generating PDF:", err);
        res.status(500).json({ error: "Failed to generate PDF" });
        return;
      }

      // Set up Nodemailer transporter
      const transporter = nodemailer.createTransport({
        // Specify your email service and credentials
        service: 'Gmail',
        auth: {
          user: '.',
          pass: ''
        }
      });

      // Define email options
      const mailOptions = {
        from: 'your_email@gmail.com',
        to: recipientEmail,
        subject: 'Payment Receipt',
        html: '<p>Thank you for your payment. Please find your receipt attached.</p>',
        attachments: [
          {
            filename: 'receipt.pdf',
            content: buffer
          }
        ]
      };

      // Send email
      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: 'Receipt sent successfully' });
    });
  } catch (error) {
    console.error("Error sending receipt:", error);
    res.status(500).json({ error: "Failed to send receipt" });
  }
};
