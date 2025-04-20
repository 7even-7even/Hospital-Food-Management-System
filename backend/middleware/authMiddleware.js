import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Middleware to verify JWT token and attach user
export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.header("Authorization");

        console.log("🔹 Incoming Authorization Header:", authHeader || "None");

        // 🔍 Check if token exists and is well-formed
        if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: Missing or malformed token" });
        }

        // ✂️ Extract token
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: Token missing after Bearer" });
        }

        // 🔓 Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token Decoded:", decoded);

        // 👤 Find user without password
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        // 🪄 Attach user to request
        req.user = user;
        next();
    } catch (error) {
        console.error("❌ JWT Error:", error.message);
        return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
};

// 🔐 Middleware to check allowed roles
export const roleMiddleware = (...roles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized: No user data found" });
            }

            const allowedRoles = roles.map(role => role.toLowerCase());
            const userRole = req.user.role?.toLowerCase();

            console.log(`🔍 Role Check: ${userRole} vs [${allowedRoles.join(", ")}]`);

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({ message: "Forbidden: You don't have permission" });
            }

            next();
        } catch (err) {
            console.error("❌ Role Middleware Error:", err.message);
            return res.status(500).json({ message: "Server error during role validation" });
        }
    };
};
