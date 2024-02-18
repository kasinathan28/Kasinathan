const Booking = require("../models/Bookings");

exports.newBooking = async (req, res) => {
    const { profileId, productId, paymentIntentId } = req.body;
    console.log(req.body);
    console.log("in try for stroing new booking data");

    try {
        // Create a new booking instance
        const newBooking = new Booking({
            UserId: profileId,
            productId: productId,
            paymentIntentId: paymentIntentId
        });

        await newBooking.save();
        res.status(200).json({ message: "Booking created successfully" });
    } catch (error) {
        console.error("Error creating new booking:", error);
        res.status(500).json({ error: "Failed to create new booking" });
    }
};