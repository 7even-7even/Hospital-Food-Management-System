import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 🔐 REGISTER FUNCTION
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password and create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, role });

        const userWithoutPassword = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        res.status(201).json({ message: "User registered successfully", user: userWithoutPassword });
    } catch (error) {
        console.error("❌ Register Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// 🔐 LOGIN FUNCTION
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // ✅ Send token in response body AND also as cookie (optional)
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // set true if using HTTPS
            sameSite: "Lax",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        const userWithoutPassword = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        // 👇👇 Return token in response so frontend can store it in localStorage
        res.status(200).json({
            message: "Login successful",
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
// 🔓 LOGOUT FUNCTION
export const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false, // set to true if using HTTPS
        sameSite: "Lax"
    });

    res.status(200).json({ message: "Logout successful" });
};
