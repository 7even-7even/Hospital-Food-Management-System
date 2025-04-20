import Order from "../models/Order.js";
import FoodItem from "../models/FoodItem.js";
import User from "../models/User.js";
import { generateBill } from "../utils/generateBill.js"; // ensure utils is set up

// ✅ Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("patientId", "name email")
      .populate("foodItems.foodId", "name price");

    res.status(200).json(orders);
  } catch (err) {
    console.error("❌ Error fetching all orders:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Pending", "Preparing", "Delivered"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated", order: updatedOrder });
  } catch (err) {
    console.error("❌ Error updating order status:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Add New Food Item
export const addFoodItem = async (req, res) => {
  try {
    const newFood = await FoodItem.create(req.body);
    res.status(201).json({ message: "Food item added", food: newFood });
  } catch (err) {
    console.error("❌ Error adding food item:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get All Food Items
export const getAllFoodItems = async (req, res) => {
  try {
    const items = await FoodItem.find();
    res.status(200).json(items);
  } catch (err) {
    console.error("❌ Error fetching food items:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Download Bill PDF for any order
export const downloadBillForAnyOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("patientId", "name email")
      .populate("foodItems.foodId", "name price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const pdfBuffer = await generateBill(order);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=bill_${orderId}.pdf`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("❌ Error downloading bill:", err);
    res.status(500).json({ message: "Server error" });
  }
};
