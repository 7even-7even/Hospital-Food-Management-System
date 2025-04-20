import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/ManageOrder.css";

const ManageOrder = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/api/orders/my", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setOrders(res.data);
            } catch (err) {
                console.error("❌ Failed to fetch orders:", err);
                setError("Failed to load your orders.");
            }
        };

        fetchOrders();
    }, []);

    // Enable horizontal scrolling using vertical mouse wheel
    useEffect(() => {
        const container = scrollRef.current;

        const handleWheel = (e) => {
            if (container) {
                e.preventDefault();
                container.scrollLeft += e.deltaY; // scroll horizontally on vertical scroll
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

    const downloadBill = async (orderId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:5000/api/orders/bill/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Order_Bill_${orderId}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error("❌ Error downloading bill:", err);
        }
    };

    return (
        <div className="manage-orders-container">
            {/* <h2>📦 Your Orders</h2> */}
            {error && <p className="error">{error}</p>}

            {orders.length === 0 ? (
                <p>No past orders found. Go ahead and try something delicious!</p>
            ) : (
                <div className="order-scroll-wrapper" ref={scrollRef}>
                    {orders.map((order) => (
                        <div key={order._id} className="order-card">
                            <p><strong>Order ID:</strong> {order._id}</p>
                            <p><strong>Status:</strong> {order.status}</p>
                            <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>

                            <ul>
                                {order.items.map((item, index) => (
                                    <li key={index}>
                                        {item.name} × {item.quantity} — ₹{item.price * item.quantity}
                                    </li>
                                ))}
                            </ul>

                            <button onClick={() => downloadBill(order._id)}>📄 Download Bill</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageOrder;
