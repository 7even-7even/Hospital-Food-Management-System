import express from "express";
import {
  getAllOrders,
  updateOrderStatus,
  addFoodItem,
  getAllFoodItems,
  downloadBillForAnyOrder,
} from "../controller/managementController.js";

import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes below are protected & allowed only for management
router.use(authMiddleware);
router.use(roleMiddleware("management"));

// Orders
router.get("/orders", getAllOrders);
router.patch("/orders/:orderId/status", updateOrderStatus);
router.get("/orders/:orderId/bill", downloadBillForAnyOrder);

// Food Items
router.post("/food", addFoodItem);
router.get("/food", getAllFoodItems);

export default router;
