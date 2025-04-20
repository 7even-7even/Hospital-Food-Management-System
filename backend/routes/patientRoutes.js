import express from "express";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";
import { getPatientDashboard } from "../controller/patientController.js";
import { createDietPlan, getPatientDietPlan } from "../controller/dietController.js";


const router = express.Router();

router.get("/dashboard", authMiddleware, roleMiddleware(["patient"]), getPatientDashboard);
router.get("/plan", authMiddleware, roleMiddleware("patient"), getPatientDietPlan);
router.post("/add-diet", authMiddleware, roleMiddleware("dietitian"), createDietPlan);

console.log("✅ Diet routes loaded");

export default router;
