// src/OrderList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from the API
    axios.get('http://localhost:5000/orders')
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the orders!', error);
      });
  }, []);

  return (
    <div>
      <h2>Order List</h2>
      <ul>
        {orders.map(order => (
          <li key={order.id}>
            Order ID: {order.id}, Patient ID: {order.patientId}, Menu ID: {order.menuId}, Quantity: {order.quantity}, Status: {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;
