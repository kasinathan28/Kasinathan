const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Cancellation = require("../models/Cancellations");
const Bookings = require("../models/Bookings");

exports.newCancellation = async(req, res)=>{
    const {profileId } = req.params;
    const {paymentIntentId,reason} = req.body;
    console.log(req.body);
    console.log(req.params);
    try {
        const newReq = new Cancellation({   
            userId:profileId,
            paymentIntentId:paymentIntentId,
            reason:reason
        });
        await newReq.save();
        console.log(newReq);
        res.status(200).json(newReq);
    } catch (error) {
        console.log("Error adding new cancellations", error);
    }
 }

// Get all the cancellations 
 exports.Cancellations = async(req, res) =>{
    try {
        const response = await Cancellation.find();
        res.status(200).json(response);
        console.log("Successfully fetched the Cancellations");
    } catch (error) {
        console.log("Error fetching the cancellations", error);
        res.status(500).json({messsage :"Error fetching the cancellations"})
    }
 }


//  Delete a req from the cancellations
exports.deleteCancellation = async(req, res) =>{
    const id = req.params;
    console.log(id);
    try{
        const response = await Cancellation.findByIdAndDelete(id.id);
        res.status(200).json(response);
        console.log("Deleted the request");
    }
    catch(error){
        console.log("Error deleting the cancellation req", error);
    }
}


// Approve a cancellation request.
exports.approveCancellation = async (req, res) => {
    const { id } = req.params;
    const { paymentIntentId } = req.body;

    try {
        // Retrieve the payment intent
        const charge = await stripe.paymentIntents.retrieve(paymentIntentId);
        const latestChargeId = charge.latest_charge;
        console.log('Latest charge:', latestChargeId);

        // Create a refund for the charge
        const refund = await stripe.refunds.create({ charge: latestChargeId });
        console.log('Refund:', refund);

        // Delete the cancellation
        const cancellation = await Cancellation.findByIdAndDelete(id);
        if (!cancellation) {
            throw new Error('Cancellation not found');
        }
        console.log('Cancellation deleted:', cancellation);

        // Find and delete the booking associated with the paymentIntentId
        const booking = await Bookings.findOneAndDelete({ paymentIntentId });
        if (!booking) {
            throw new Error('Booking not found');
        }
        console.log('Booking deleted:', booking);

        res.status(200).json({ message: 'Cancellation approved successfully' });
    } catch (error) {
        console.error('Error approving the cancellation:', error.message);
        res.status(500).json({ message: 'Error approving the cancellation', error: error.message });
    }
};
