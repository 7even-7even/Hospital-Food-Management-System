import express from "express";
import { askQuestion, getQuestions, answerQuestion } from "../controller/questionController.js";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("patient"), askQuestion);  // ✅ Patients ask questions
router.get("/", authMiddleware, roleMiddleware("nutritionist"), getQuestions);  // ✅ Nutritionists see all questions
router.put("/:id", authMiddleware, roleMiddleware("nutritionist"), answerQuestion);  // ✅ Nutritionists answer

export default router;
