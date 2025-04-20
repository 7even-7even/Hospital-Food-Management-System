import DietPlan from "../models/DietPlan.js";

// ✅ Get diet plan for logged-in patient
export const getPatientDietPlan = async (req, res) => {
  try {
    console.log("🔍 Diet Plan requested for:", req.user._id);

    const plan = await DietPlan.findOne({ patientId: req.user._id });

    if (!plan) {
      return res.status(404).json({ message: "No diet plan found for this patient." });
    }

    res.status(200).json(plan);
  } catch (err) {
    console.error("❌ Error fetching diet plan:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


// 🔧 TEMP: Add dummy plan (for testing only, use Postman)
export const createDietPlan = async (req, res) => {
  try {
    const { patientId, meals } = req.body;

    const newPlan = await DietPlan.create({ patient: patientId, meals });

    res.status(201).json({ message: "Diet plan created", plan: newPlan });
  } catch (err) {
    console.error("❌ Error creating diet plan:", err);
    res.status(500).json({ message: "Server error" });
  }
};
