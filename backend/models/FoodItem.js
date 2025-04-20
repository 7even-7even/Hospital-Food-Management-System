// models/FoodItems.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const foodItemSchema = new mongoose.Schema({
    name: String,
    price: Number,
    calories: Number,
    carbs: Number,
    fat: Number,
    reviews: [reviewSchema]
});

export default mongoose.model("Food", foodItemSchema);
