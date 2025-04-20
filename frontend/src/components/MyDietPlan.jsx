import { useEffect, useState } from "react";
import axios from "axios";
import '../styles/MyDietPlan.css';


const MyDietPlan = () => {
    const [dietPlan, setDietPlan] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDietPlan = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get("http://localhost:5000/api/patient/plan", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                console.log("✅ Diet Plan:", res.data);

                setDietPlan(res.data);
            } catch (err) {
                console.error("Error fetching diet plan:", err);
                setError(err.response?.data?.message || "Something went wrong");
            }
        };

        fetchDietPlan();
    }, []);

    return (
        <div className="diet-plan-container">
            {/* <h2>My Diet Plan</h2> */}

            {error && <p className="error">{error}</p>}

            {!dietPlan ? (
                <p>No diet plan assigned yet.</p>
            ) : dietPlan.meals && dietPlan.meals.length > 0 ? (
                <div className="diet-details">
                    {dietPlan.meals.map((meal, index) => (
                        <div key={index} className="meal-card">
                            <h3>{meal.time}</h3>
                            <ul>
                                {meal.items.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                            <p>Calories: {meal.calories}</p>
                            <p>Carbs: {meal.carbs}g</p>
                            <p>Fat: {meal.fat}g</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No meals found in your diet plan yet.</p>
            )}
        </div>
    );
};

export default MyDietPlan;
