import express from "express";
import { placeOrder, getMyOrders, getAllOrders, updateOrderStatus,downloadBill } from "../controller/orderController.js";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("patient"), placeOrder);  // ✅ Patients place orders
router.get("/my", authMiddleware, roleMiddleware("patient"), getMyOrders);  // ✅ Patients view their orders
router.get("/all", authMiddleware, roleMiddleware("management"), getAllOrders);  // ✅ Management views all orders
router.patch("/:orderId", authMiddleware, roleMiddleware("management"), updateOrderStatus);  // ✅ Management updates order status
router.put("/:orderId/status", roleMiddleware(["management"]), updateOrderStatus);
router.get("/bill/:orderId", authMiddleware, downloadBill);

export default router;
