import express from "express";
import { getAllFoodItems } from "../controller/foodController.js";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only patients can access this
router.get("/", authMiddleware, roleMiddleware("patient"), getAllFoodItems);

export default router;
