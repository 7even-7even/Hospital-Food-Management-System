import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "../styles/FoodItems.css";
import Cart from "./Cart";

ChartJS.register(ArcElement, Tooltip, Legend);

const FoodItems = () => {
    const [foodItems, setFoodItems] = useState([]);
    const [error, setError] = useState("");
    const [cart, setCart] = useState([]);
    const [showCartModal, setShowCartModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const scrollRef = useRef(null); // ⬅️ ref for horizontal scrolling

    useEffect(() => {
        const container = scrollRef.current;

        const handleWheel = (e) => {
            if (container) {
                e.preventDefault();
                container.scrollLeft += e.deltaY; // Convert vertical to horizontal scroll
            }
        };

        if (container) {
            container.addEventListener("wheel", handleWheel, { passive: false });
        }

        return () => {
            if (container) {
                container.removeEventListener("wheel", handleWheel);
            }
        };
    }, []);

    useEffect(() => {
        const fetchFoodItems = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Unauthorized: No token found.");
                    return;
                }

                const res = await axios.get("http://localhost:5000/api/food", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                let allItems = [];

                if (Array.isArray(res.data.foodItems)) {
                    res.data.foodItems.forEach(item => {
                        if (item.name) {
                            allItems.push(item);
                        } else if (Array.isArray(item.foodItems)) {
                            allItems.push(...item.foodItems);
                        }
                    });

                    if (allItems.length === 0) {
                        setError("❌ No valid food items found.");
                    } else {
                        setFoodItems(allItems);
                    }
                } else {
                    setError("❌ Unexpected response format.");
                }
            } catch (err) {
                console.error("❌ Error fetching food items:", err);
                setError("Failed to fetch food items. Please try again later.");
            }
        };

        fetchFoodItems();
    }, []);

    const renderChart = (item) => ({
        labels: ["Carbs", "Protein", "Fat"],
        datasets: [
            {
                label: "Nutrition",
                data: [item.carbs, item.protein, item.fat],
                backgroundColor: ["#f39c12", "#2ecc71", "#e74c3c"],
                borderWidth: 1,
            },
        ],
    });

    const addToCart = (item) => {
        setCart((prevCart) => [...prevCart, { ...item, quantity: 1 }]);
    };

    const isInCart = (foodId) => cart.some(item => item._id === foodId);

    const placeOrder = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Unauthorized: No token found.");
                return;
            }

            const response = await axios.post(
                "http://localhost:5000/api/orders",
                { cart },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setShowSuccessModal(true);
            setCart([]);
            setShowCartModal(false);

            setTimeout(() => {
                setShowSuccessModal(false);
            }, 3000);
        } catch (error) {
            console.error("❌ Failed to place order:", error);
            setError("Failed to place order. Please try again.");
        }
    };

    return (
        <div className="food-items-page">
            {error && <p className="error">{error}</p>}

            {showSuccessModal && (
                <div className="success-modal">
                    <div className="modal-content">
                        <h3>✅ Order Placed Successfully!</h3>
                        <button onClick={() => setShowSuccessModal(false)}>Close</button>
                    </div>
                </div>
            )}

            <div className="food-scroll-wrapper" ref={scrollRef}>
                <div className="food-grid">
                    {foodItems.map((item) => (
                        <div key={item._id} className="food-card">
                            <h3>{item.name}</h3>
                            <p><strong>Price:</strong> Rs {item.price}</p>
                            <div className="pie-chart">
                                <Pie data={renderChart(item)} />
                            </div>

                            <div className="food-details">
                                <p><strong>Fat:</strong> {item.fat}g</p>
                                <p><strong>Calories:</strong> {item.calories}</p>
                                <p><strong>Carbs:</strong> {item.carbs}g</p>
                                <p><strong>Protein:</strong> {item.protein}g</p>
                            </div>

                            <div className="cart-section">
                                {!isInCart(item._id) ? (
                                    <button onClick={() => addToCart(item)}>Add to Cart</button>
                                ) : (
                                    <button onClick={() => addToCart(item)}>Added</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button className="view-cart-btn" onClick={() => setShowCartModal(true)}>
                🛒 View Cart
            </button>

            {showCartModal && (
                <Cart
                    cart={cart}
                    setCart={setCart}
                    setShowCartModal={setShowCartModal}
                    placeOrder={placeOrder}
                />
            )}
        </div>
    );
};

export default FoodItems;
