import Order from "../models/Order.js";
import FoodItem from "../models/FoodItem.js";
import { generateBill } from "../utils/generateBill.js"; // ✅ Import bill generator

// Place Order API
export const placeOrder = async (req, res) => {
    const { cart } = req.body; // Cart items sent from the frontend

    // Validate cart items for missing price or quantity
    for (let item of cart) {
        if (!item.price || !item.quantity) {
            return res.status(400).json({ message: "Missing price or quantity for one or more items." });
        }
    }

    try {
        // Create new order
        const newOrder = new Order({
            user: req.user.id,  // Get user ID from the JWT token
            items: cart,        // Store cart items
            totalPrice: cart.reduce((total, item) => total + item.price * item.quantity, 0), // Calculate total price
            status: "Pending",  // Order status can be Pending initially
        });

        // Save the new order to the database
        const savedOrder = await newOrder.save();

        res.status(201).json({
            message: "Order placed successfully",
            order: savedOrder,
        });
    } catch (error) {
        console.error("❌ Error placing order:", error);
        res.status(500).json({ message: "Failed to place the order" });
    }
};

// ✅ Patients View Their Orders
// Only fetch orders belonging to the logged-in patient
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate("items._id", "name price") // Optional: Populate food details
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error("❌ Error fetching orders:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// ✅ Management View All Orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("patientId", "name")
            .populate("foodItems.foodId", "name price");
        res.json(orders);
    } catch (error) {
        console.error("❌ Error fetching all orders:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Management Update Order Status
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const allowedStatuses = ["Pending", "Preparing", "Delivered"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) return res.status(404).json({ message: "Order not found" });

        res.json({ message: "Order status updated", order });
    } catch (error) {
        console.error("❌ Error updating order status:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Download/View Bill for a Specific Order
export const downloadBill = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        const order = await Order.findById(orderId).populate("user");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        generateBill(order, res); // ✅ Make sure res is passed
    } catch (error) {
        console.error("❌ Error generating/downloading bill:", error);
        res.status(500).json({ message: "Error generating/downloading bill" });
    }
};

export const downloadBillForAnyOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId)
            .populate("patientId", "name email")
            .populate("foodItems.foodId", "name price");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Generate PDF using utility
        const pdfBuffer = await generateBillPDF(order);

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=bill_${orderId}.pdf`,
        });

        res.send(pdfBuffer);
    } catch (err) {
        console.error("❌ Error downloading bill (management):", err);
        res.status(500).json({ message: "Server error" });
    }
};
