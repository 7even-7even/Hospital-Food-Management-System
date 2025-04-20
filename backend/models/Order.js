import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food" }, // 🆕 Reference for populate
            name: String,
            price: Number,
            quantity: Number
        },
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "Pending" },
}, { timestamps: true });

export default mongoose.model("Order", OrderSchema);
