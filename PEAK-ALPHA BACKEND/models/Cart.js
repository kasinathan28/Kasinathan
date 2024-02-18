const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({

    profileId:{
        type: String,
        required: true,
    },
    product:{
        type: String,
        required: true,
    },
    quantity:{
        type:Number,
        default:1,
    }
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;