const Users = require("../models/Users");
const Address = require("../models/Address"); 
const Product = require("../models/products")

const axios = require("axios");
const twilio = require("twilio");
const multer = require("multer");

// Twilio configuration
const accountSid = "ACe3e8a0c5012984c57f28389d766dc89d";
const authToken = "e18ea88a2125204d2dcb0e0dfedf16f3";
const twilioClient = twilio(accountSid, authToken);

const upload = require("../multerConfig/storageConfig"); // Ensure multer is properly configured in storageConfig

// Multer storage configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   },
// });

// Inside your signup route handler
// Inside your signup route handler

exports.signup = async (req, res) => {
  const { username, password, phoneNumber, email, otp } = req.body;

  try {
    // Check if the session and OTP are defined
    if (!otp || otp !== req.body.otp) {
      res.status(400).json({ error: 'Invalid OTP' });
      return;
    }

    // Clear the OTP from the session once used
    delete req.body.otp;

    // Check if the username already exists
    const existingUsername = await Users.findOne({ username });
    if (existingUsername) {
      res.status(400).json({ error: 'Username already exists' });
      return;
    }

    // Check if the phone number already exists
    const existingPhoneNumber = await Users.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      res.status(400).json({ error: 'Phone number already exists' });
      return;
    }

    // Check if the email already exists
    const existingEmail = await Users.findOne({ email });
    if (existingEmail) {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }

    const newUser = new Users({
      username,
      password, // Note: In a production environment, consider hashing the password before saving it to the database
      phoneNumber,
      email,
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'An error occurred during signup' });
  }
};


// Endpoint to send OTP to the provided phone number
exports.generateAndSendOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    // Validate that the provided OTP is not empty
    if (!otp) {
      res.status(400).json({ error: "Invalid OTP" });
      return;
    }

    // Send the provided OTP to the specified phone number using Twilio
    await twilioClient.messages.create({
      body: `Your OTP for signup: ${otp}`,
      to: `+91${phoneNumber}`, // Make sure to format the phone number correctly
      from: "+18083536054",
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error during OTP sending:", error);
    res.status(500).json({ error: "An error occurred during OTP sending" });
  }
};



// user login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Users.findOne({ username });

    if (!user || user.password !== password) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
};


/// fetching user data
exports.getUserData = async (req, res) => {
  const { username } = req.body; // Change to req.body since you are sending username in the request body

  try {
    console.log("Received username:", username);

    const user = await Users.findOne({ username });

    if (!user) {
      console.log("User not found for username:", username);
      res.status(404).json({ error: "User not found...!" });
      return;
    }

    // Extract only necessary user data to send to the client
    const userData = {
      name: user.username,
      phoneNumber: user.phoneNumber,
      email: user.email,
      password: user.password,
      profilePicture: user.profilePicture,
      // Add other fields as needed
    };

    console.log("User Data:", userData);
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "An error occurred while fetching user data" });
  }
};



// Assuming multer is configured with the appropriate storage and is available in the 'upload' variable

exports.updateprofile = async (req, res) => {
  const { username, name, phoneNumber, password, email } = req.body;
  const { filename, path } = req.file; // Assuming multer provides the file information

  try {
    // Update the user profile in the database with the new file information
    const updateFields = {
      name,
      phoneNumber,
      password,
      email,
    };

    // Add profilePicture to updateFields if it is provided
    if (path) {
      updateFields.profilePicture = { path };
    }

    const updatedUser = await Users.findOneAndUpdate(
      { username },
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error during profile update:", error);
    res.status(500).json({ error: "An error occurred during profile update" });
  }
};





// Get user's address by username
exports.getUserAddress = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await Users.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userAddress = await Address.findById(user.addressId);

    if (!userAddress) {
      return res.status(404).json({ error: "User address not found" });
    }

    res.status(200).json({ address: userAddress });
  } catch (error) {
    console.error("Error fetching user's address:", error);
    res.status(500).json({ error: "An error occurred fetching user's address" });
  }
};


// Router for updating the address
exports.updateAddress = async (req, res) => {
  const { username } = req.params;
  const { pincode, city, houseName, landmark } = req.body;

  try {
    // Find the user by username
    const user = await Users.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find or create the user's address based on the provided parameters
    const userAddress = await Address.findOneAndUpdate(
      { pincode, city, houseName, landmark },
      { pincode, city, houseName, landmark },
      { new: true, upsert: true }
    );

  

    // Update the user's address ID in the Users collection
    user.addressId = userAddress._id;
    await user.save();

    res.status(200).json({ message: "Address updated successfully", address: userAddress });
  } catch (error) {
    console.error("Error during address update:", error);
    res.status(500).json({ error: "An error occurred during address update" });
  }
};

// get all products
exports.getAllProducts1 = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'An error occurred while fetching products' });
  }
};



exports.getAllProducts3 = async (req, res) => {
  try {
    // Make a request to the Stripe API
    const response = await axios.get('https://api.stripe.com/v1/products', {
      headers: {
        Authorization: `Bearer sk_test_51Od4KTSF48OWvv58UGojVhgsx9EAR0yoi4za3ocnGYtqNjXaA1PFuIYwFzkz9nyY1Y0CwWSJ3sh1hSDgWcsJFJ2Q003A3cQeTs`,
      },
    });
    
    const products = response.data.data;
    res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching products from Stripe API:', error);
    res.status(500).json({ error: 'An error occurred while fetching products from Stripe API' });
  }
};
