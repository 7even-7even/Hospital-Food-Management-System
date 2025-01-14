// src/OrderForm.js
import React, { useState } from 'react';
import axios from 'axios';

const OrderForm = () => {
  const [patientId, setPatientId] = useState('');
  const [menuId, setMenuId] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const orderData = {
      patientId,
      menuId,
      quantity,
      totalPrice: quantity * 200.00,  // Assuming average price (you can update with dynamic pricing)
      status: 'Pending'
    };

    axios.post('http://localhost:5000/orderform', orderData)
      .then(response => {
        alert('Order placed successfully!');
      })
      .catch(error => {
        console.error('There was an error placing the order!', error);
      });
  };

  return (
    <div>
      <h2>Place Order</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Patient ID:</label>
          <input 
            type="number" 
            value={patientId} 
            onChange={(e) => setPatientId(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Menu ID:</label>
          <input 
            type="number" 
            value={menuId} 
            onChange={(e) => setMenuId(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default OrderForm;
