const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({

    username:{
        type: String,
        required: true,
    },
    product:{
        type: String,
        required: true,
    }
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;