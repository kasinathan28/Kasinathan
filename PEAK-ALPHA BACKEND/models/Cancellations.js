const mongoose = require("mongoose");

const CancellationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  paymentIntentId: {
    type: String,
    required: true,
  },
  reason:{
    type:String,
  }
});

const Cancellation = mongoose.model("Cancellation", CancellationSchema);

module.exports = Cancellation;

