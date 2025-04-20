import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    questionText: { type: String, required: true },
    nutritionistId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    answerText: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Question", QuestionSchema);
