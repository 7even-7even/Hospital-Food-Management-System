import Question from "../models/Question.js";

// ✅ Patients Submit a Question
export const askQuestion = async (req, res) => {
    try {
        const { questionText } = req.body;
        const patientId = req.user.id; // From authMiddleware

        const question = await Question.create({ patientId, questionText });

        res.status(201).json({ message: "Question submitted successfully", question });
    } catch (error) {
        console.error("❌ Error asking question:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Nutritionists Fetch Unanswered Questions
export const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find().populate("patientId", "name email");
        res.json(questions);
    } catch (error) {
        console.error("❌ Error fetching questions:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Nutritionists Answer a Question
export const answerQuestion = async (req, res) => {
    try {
        const { answerText } = req.body;
        const questionId = req.params.id;
        const nutritionistId = req.user.id; // From authMiddleware

        const question = await Question.findById(questionId);
        if (!question) return res.status(404).json({ message: "Question not found" });

        question.answerText = answerText;
        question.nutritionistId = nutritionistId;
        await question.save();

        res.json({ message: "Answer submitted successfully", question });
    } catch (error) {
        console.error("❌ Error answering question:", error);
        res.status(500).json({ message: "Server error" });
    }
};
