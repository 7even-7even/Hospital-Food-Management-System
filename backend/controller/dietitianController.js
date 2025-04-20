import User from "../models/User.js";
import DietPlan from "../models/DietPlan.js";
import Question from "../models/Question.js";

// ✅ View questions assigned to the logged-in dietitian
export const getAssignedQuestions = async (req, res) => {
  try {
    const dietitianId = req.user.id;

    const questions = await Question.find({ nutritionistId: dietitianId })
      .populate("patientId", "name email") // show patient info
      .sort({ createdAt: -1 });

    if (!questions.length) {
      return res.status(404).json({ message: "No questions assigned yet." });
    }

    res.status(200).json(questions);
  } catch (err) {
    console.error("❌ Error fetching assigned questions:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const answerQuestion = async (req, res) => {
  try {
    const dietitianId = req.user.id;
    const { questionId } = req.params;
    const { answerText } = req.body;

    // Check if question exists and is assigned to the logged-in dietitian
    const question = await Question.findOne({
      _id: questionId,
      nutritionistId: dietitianId,
    });

    if (!question) {
      return res.status(404).json({ message: "Question not found or not assigned to you." });
    }

    // Update the answer
    question.answerText = answerText;
    await question.save();

    res.status(200).json({ message: "Answer submitted successfully", question });
  } catch (err) {
    console.error("❌ Error answering question:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔸 Dietitian Dashboard Placeholder
export const dietitianDashboard = (req, res) => {
  res.json({ message: "Welcome to Dietitian Dashboard!" });
};

// ✅ View All Patients with Their Diet Plans
export const getAllPatientsWithDietPlans = async (req, res) => {
  try {
    // Get all users with role 'patient'
    const patients = await User.find({ role: "patient" }).select("-password"); // Exclude password

    // For each patient, also fetch their diet plan (if any)
    const patientsWithPlans = await Promise.all(
      patients.map(async (patient) => {
        const plan = await DietPlan.findOne({ patient: patient._id });

        return {
          ...patient.toObject(),
          dietPlan: plan || null,
        };
      })
    );

    res.status(200).json(patientsWithPlans);
  } catch (error) {
    console.error("❌ Error fetching patients and diet plans:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const assignOrUpdateDietPlan = async (req, res) => {
  try {
    const { patientId, meals } = req.body;

    // Validate meals structure (basic)
    if (!meals || !Array.isArray(meals) || meals.length === 0) {
      return res.status(400).json({ message: "Invalid or empty meals array" });
    }

    // Check if a plan already exists
    let existingPlan = await DietPlan.findOne({ patient: patientId });

    if (existingPlan) {
      // 🔁 Update existing plan
      existingPlan.meals = meals;
      await existingPlan.save();
      return res.status(200).json({ message: "Diet plan updated", plan: existingPlan });
    } else {
      // ➕ Create a new plan
      const newPlan = await DietPlan.create({ patient: patientId, meals });
      return res.status(201).json({ message: "Diet plan assigned", plan: newPlan });
    }
  } catch (error) {
    console.error("❌ Error assigning/updating diet plan:", error);
    res.status(500).json({ message: "Server error" });
  }
};
