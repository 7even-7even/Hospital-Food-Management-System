import React, { useState } from "react";
import "../styles/Cart.css";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"];

const Cart = ({ cart, setCart, placeOrder }) => {
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const removeFromCart = (foodId) => {
        setCart((prevCart) => prevCart.filter(item => item._id !== foodId));
    };

    const increaseQuantity = (foodId) => {
        setCart((prevCart) =>
            prevCart.map(item =>
                item._id === foodId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decreaseQuantity = (foodId) => {
        setCart((prevCart) =>
            prevCart.map(item =>
                item._id === foodId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 } : item
            )
        );
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    const getNutrientData = (item) => [
        { name: "Fat", value: item.fat || 0 },
        { name: "Carbs", value: item.carbs || 0 },
        { name: "Protein", value: item.protein || 0 },
        { name: "Calories", value: item.calories || 0 }
    ];

    const handlePlaceOrder = () => {
        placeOrder(); // your original placeOrder logic
        setOrderSuccess(true);
        setShowPopup(true);
        setTimeout(() => {
            setShowPopup(false);
            setCart([]); // clear cart after success
        }, 3000);
    };

    return (
        <div className="cart-section">
            <h2>Your Cart</h2>

            {/* New animated success toast */}
            {showPopup && (
                <div className="toast-success">
                    <span className="check-icon">✅</span> Order placed successfully!
                </div>
            )}

            {!orderSuccess && cart.length === 0 ? (
                <p>No items to display yet. Kindly select a food item to be added.</p>
            ) : (
                <>
                    {!orderSuccess && (
                        <ul className="cart-list">
                            {cart.map((item) => (
                                <li key={item._id} className="cart-item">
                                    <div className="item-info">
                                        <p><strong>{item.name}</strong> - Rs {item.price} × {item.quantity}</p>
                                        <div className="btn-group">
                                            <button onClick={() => increaseQuantity(item._id)}>+</button>
                                            <button onClick={() => decreaseQuantity(item._id)}>-</button>
                                            <button onClick={() => removeFromCart(item._id)}>Remove</button>
                                        </div>
                                    </div>

                                    <div className="chart-wrapper">
                                        <ResponsiveContainer width={240} height={170}>
                                            <PieChart>
                                                <Pie
                                                    data={getNutrientData(item)}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={70}
                                                    label
                                                >
                                                    {getNutrientData(item).map((_, index) => (
                                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {!orderSuccess && (
                        <>
                            <p style={{ fontWeight: "700", fontSize: "2rem" }}>
                                <strong>Total:</strong> Rs {getTotalPrice()}
                            </p>
                            <button className="place-order-btn" onClick={handlePlaceOrder}>
                                Place Order
                            </button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Cart;
