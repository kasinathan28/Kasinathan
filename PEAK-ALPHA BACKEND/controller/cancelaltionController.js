const Cancellation = require("../models/Cancellations");

exports.newCancellation = async(req, res)=>{
    const {profileId } = req.params;
    const {paymentIntentId} = req.body;
    console.log(req.params);
    try {
        const newReq = new Cancellation({
            userId:profileId,
            paymentIntentId:paymentIntentId,
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
 