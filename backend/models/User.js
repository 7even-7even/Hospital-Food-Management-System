import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["patient", "dietitian", "management"],
    required: true
  },
  profile: {
    age: Number,
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    height: Number, // in cm
    weight: Number, // in kg
    medicalHistory: [String], // ["Diabetes", "Hypertension"]
    allergies: [String],
    assignedDietitian: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // 🔗 New field
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
