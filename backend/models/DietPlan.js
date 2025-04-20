import mongoose from "mongoose";

const dietPlanSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  meals: [
    {
      time: String, // Breakfast, Lunch, Dinner
      items: [String], // ["Oats", "Fruits"]
      calories: Number,
      carbs: Number,
      fat: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DietPlan = mongoose.model("DietPlan", dietPlanSchema);
export default DietPlan;
