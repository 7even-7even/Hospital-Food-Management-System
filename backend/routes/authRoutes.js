import express from "express";
import { register, login, logout } from "../controller/authController.js";

const router = express.Router();

// Debugging - Log when the routes are hit
router.use((req, res, next) => {
  console.log(`🔗 Hit auth route: ${req.method} ${req.url}`);
  next();
});

router.post("/register", register);
router.post("/login", login);
router.post('/logout', logout);

export default router;
