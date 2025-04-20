import express from "express";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";
import { dietitianDashboard } from "../controller/dietitianController.js";
import { getAllPatientsWithDietPlans, assignOrUpdateDietPlan, getAssignedQuestions, answerQuestion  } from "../controller/dietitianController.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, roleMiddleware(["dietitian"]), dietitianDashboard);
router.get("/patients", authMiddleware, roleMiddleware("dietitian"), getAllPatientsWithDietPlans);
router.post("/add-diet", authMiddleware, roleMiddleware("dietitian"), assignOrUpdateDietPlan);
router.get("/questions", authMiddleware, roleMiddleware("dietitian"), getAssignedQuestions);
router.patch("//questions/:questionId/answer", authMiddleware, roleMiddleware("dietitian"), answerQuestion);

export default router;
