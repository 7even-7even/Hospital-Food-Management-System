const express = require('express');
const router = express.Router();
const db = require('../db');

// Place a new order
router.post('/orderform', async (req, res) => {
  const { patientId, menuId, quantity, roomNumber, status } = req.body;

  if (!patientId || !menuId || !quantity || !roomNumber) {
    console.error('Validation error: Missing fields', req.body);
    return res.status(400).json({ error: 'Patient ID, Menu ID, Quantity, and Room Number are required.' });
  }
  try {
    // Fetch menu price
    const [menuResult] = await db.query('SELECT price FROM menus WHERE id = ?', [menuId]);
    if (menuResult.length === 0) {
      console.error('Menu item not found for ID:', menuId);
      return res.status(404).json({ error: 'Menu item not found.' });
    }

    const price = menuResult[0].price;
    const totalPrice = price * quantity;

    const [result] = await db.query(
      `INSERT INTO orders (patientId, menuId, quantity, totalPrice, roomNumber, orderDate, status) 
       VALUES (?, ?, ?, ?, ?, NOW(), ?)`,
      [patientId, menuId, quantity, totalPrice, roomNumber, status]
    );

    console.log('Order placed successfully:', {
      id: result.insertId,
      patientId,
      menuId,
      quantity,
      totalPrice,
      status,
    });

    res.status(201).json({
      message: 'Order placed successfully!',
      order: {
        id: result.insertId,
        patientId,
        menuId,
        quantity,
        totalPrice,
        roomNumber,
        status,
        orderDate: new Date(),
      },
    });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ error: 'Failed to place order.' });
  }
});

module.exports = router;
