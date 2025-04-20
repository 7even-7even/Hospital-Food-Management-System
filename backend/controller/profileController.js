import User from "../models/User.js";

// ✅ Get logged-in user's profile (with assigned dietitian populated)
export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password")
            .populate("profile.assignedDietitian", "name email");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (err) {
        console.error("❌ Error fetching profile:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Update logged-in user's profile (only profile object)
export const updateMyProfile = async (req, res) => {
    try {
        const updates = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { profile: updates } }, // Only update the profile object
            { new: true, runValidators: true }
        )
        .select("-password")
        .populate("profile.assignedDietitian", "name email");

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "Profile updated", user: updatedUser });
    } catch (err) {
        console.error("❌ Error updating profile:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Admin or Dietitian view a user's profile by ID (with dietitian info)
export const getUserProfileById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .select("-password")
            .populate("profile.assignedDietitian", "name email");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (err) {
        console.error("❌ Error fetching user by ID:", err);
        res.status(500).json({ message: "Server error" });
    }
};
