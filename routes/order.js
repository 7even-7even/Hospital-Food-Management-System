const express = require('express');
const router = express.Router();
const db = require('../db'); 

// Get all orders
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT orders.id, orders.orderDate, orders.status, patients.name AS patientName, menus.itemName AS menuItem FROM orders JOIN patients ON orders.patientId = patients.id JOIN menus ON orders.menuId = menus.id'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Place a new order
router.post('/', async (req, res) => {
  const { patientId, menuId } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO orders (patientId, menuId, orderDate, status) VALUES (?, ?, NOW(), "Pending")',
      [patientId, menuId]
    );
    res.json({ id: result.insertId, patientId, menuId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an order status
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Order status updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an order
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM orders WHERE id = ?', [id]);
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
