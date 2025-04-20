import express from "express";
import { getMyProfile, updateMyProfile, getUserProfileById } from "../controller/profileController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getMyProfile);
router.put("/me", authMiddleware, updateMyProfile);
router.get("/:userId", authMiddleware, getUserProfileById); // dietitian or management only (can be secured with roleMiddleware)

export default router;
