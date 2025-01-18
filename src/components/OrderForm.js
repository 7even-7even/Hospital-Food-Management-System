import React, { useState } from 'react';
import axios from 'axios';

const OrderForm = () => {
  const [patientId, setPatientId] = useState('');
  const [menuId, setMenuId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [roomNumber, setRoomNumber] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Log the data being sent
    console.log({
      patientId,
      menuId,
      quantity,
      roomNumber,
      status: 'Pending',
    });

    try {
      const response = await axios.post('http://localhost:5000/orders', {
        patientId,
        menuId,
        quantity,
        roomNumber,
        status: 'Pending',
      });
      console.log('Order placed successfully:', response.data);
    } catch (error) {
      console.error('There was an error placing the order!', error);
    }
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
        <div>
          <label>Room Number:</label>
          <input
            type="number"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            required
          />
        </div>
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default OrderForm;
