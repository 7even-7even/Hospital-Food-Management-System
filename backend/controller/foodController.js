import FoodItems from "../models/FoodItem.js";

export const getAllFoodItems = async (req, res) => {
    try {
        const rawItems = await FoodItems.find();

        // 🔍 Flatten if any item contains nested foodItems array
        let allItems = [];

        rawItems.forEach(item => {
            // If it's a nested wrapper like { foodItems: [...] }
            if (Array.isArray(item.foodItems)) {
                allItems.push(...item.foodItems);
            } else {
                // Normal item with name, calories, etc.
                allItems.push(item);
            }
        });

        res.json({ foodItems: allItems });
    } catch (error) {
        console.error("❌ Error fetching food items:", error);
        res.status(500).json({ message: "Server error" });
    }
};
