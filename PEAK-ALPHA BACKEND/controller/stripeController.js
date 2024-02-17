const Product = require("../models/products");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const generatePDF = require('../pdfGenerator'); // Import the PDF generation function
const fs = require("fs");
const nodemailer = require("nodemailer");

// Making purchase in the stripe
exports.makePurchase = async (req, res) => {
  const { productId } = req.params;
  const { priceId, shippingDetails } = req.body;
  const { fullName, address, phoneNumber, state, zip, country } =
    shippingDetails;

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



// Send the receipt as email
exports.sendReceiptByEmail = async (req, res) => {
  try {
    const demoId = req.params;
    const payment_intent = demoId.payment_intent;

    // Retrieve payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);

    // Ensure payment intent contains valid customer information
    const customerId = paymentIntent.customer;
    if (!customerId) {
      throw new Error("Payment intent does not contain a valid customer ID");
    }

    // Read the HTML content from receipt_template.html
    const htmlContent = fs.readFileSync('receipt_template.html', 'utf8');

    // Generate PDF from HTML content
    generatePDF(htmlContent, async (err, buffer) => {
      if (err) {
        res.status(500).json({ error: "Failed to generate PDF" });
        return;
      }

      // Set up Nodemailer transporter
      const transporter = nodemailer.createTransport({
        // Specify your email service and credentials
        service: "gmail",
        auth: {
          user: "peakalpha2024@gmail.com",
          pass: "poxyctjtxyxnjxsg",
        },
      });

      // Define email options
      const mailOptions = {
        from: "Peak Alpha <peakalpha2024@gmail.com>",
        to: "<mayabaiju1982@gmail.com>", // Ensure recipientEmail is defined
        subject: "Your Payment Receipt from Peak Alpha",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="color: #1e90ff;">Payment Receipt</h1>
            <p style="font-size: 16px;">Dear Customer,</p>
            <p style="font-size: 16px;">Thank you for your recent purchase from Peak Alpha. We appreciate your business!</p>
            <p style="font-size: 16px;">Please find your payment receipt attached.</p>
            <hr style="border: 1px solid #ccc; margin: 20px 0;">
            <p style="font-size: 16px;">If you have any questions or concerns, feel free to <a href="mailto:support@peakalpha.com" style="color: #1e90ff; text-decoration: none;">contact our support team</a>.</p>
            <p style="font-size: 16px;">Best regards,<br>Peak Alpha Team</p>
          </div>
        `,
        attachments: [
          {
            filename: "New Order Receipt from Peak Alpha.pdf",
            content: buffer,
          },
        ],
      };
      // Send email
      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "Receipt sent successfully" });
    });
  } catch (error) {
    console.error("Error sending receipt:", error);
    res.status(500).json({ error: "Failed to send receipt" });
  }
};