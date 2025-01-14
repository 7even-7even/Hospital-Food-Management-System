const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM menus');
    res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching menu items:', err.message);
    res.status(500).json({ error: 'Failed to fetch menu items.' });
  }
});

// Add a new menu item
router.post('/', async (req, res) => {
  const { itemName, dietType, calories, availability } = req.body;

  if (!itemName || !dietType || !calories || availability === undefined) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO menus (itemName, dietType, calories, availability) VALUES (?, ?, ?, ?)',
      [itemName, dietType, calories, availability]
    );
    res.status(201).json({ id: result.insertId, itemName, dietType, calories, availability });
  } catch (err) {
    console.error('Error adding menu item:', err.message);
    res.status(500).json({ error: 'Failed to add menu item.' });
  }
});

// Update a menu item
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { itemName, dietType, calories, availability } = req.body;

  if (!itemName || !dietType || !calories || availability === undefined) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const [result] = await db.query(
      'UPDATE menus SET itemName = ?, dietType = ?, calories = ?, availability = ? WHERE id = ?',
      [itemName, dietType, calories, availability, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu item not found.' });
    }

    res.status(200).json({ message: 'Menu updated successfully' });
  } catch (err) {
    console.error('Error updating menu item:', err.message);
    res.status(500).json({ error: 'Failed to update menu item.' });
  }
});

// Delete a menu item
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM menus WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu item not found.' });
    }

    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    console.error('Error deleting menu item:', err.message);
    res.status(500).json({ error: 'Failed to delete menu item.' });
  }
});

module.exports = router;
