const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db.js'); // Import the database connection

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Serve static files from React app (build folder)
app.use('/myapp', express.static(path.join(__dirname, 'build')));

// Fetch all menus
app.get('/menus', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM menus');
    res.json(results);
  } catch (err) {
    console.error('Error fetching menus:', err);
    res.status(500).send('Error fetching menus.');
  }
});

// Add a new menu
app.post('/menus', async (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO menus (name, description, price) VALUES (?, ?, ?)',
      [name, description, price]
    );
    res.status(201).json({
      message: 'Menu item added successfully!',
      menu: { id: result.insertId, name, description, price },
    });
  } catch (err) {
    console.error('Error adding menu item:', err);
    res.status(500).send('Error adding menu item.');
  }
});

// Update a menu item
app.put('/menus/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const [result] = await db.query(
      'UPDATE menus SET name = ?, description = ?, price = ? WHERE id = ?',
      [name, description, price, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu item not found.' });
    }

    res.status(200).json({ message: 'Menu item updated successfully!' });
  } catch (err) {
    console.error('Error updating menu item:', err);
    res.status(500).send('Error updating menu item.');
  }
});

// Delete a menu item
app.delete('/menus/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM menus WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu item not found.' });
    }

    res.status(200).json({ message: 'Menu item deleted successfully!' });
  } catch (err) {
    console.error('Error deleting menu item:', err);
    res.status(500).send('Error deleting menu item.');
  }
});

// Fetch all patients
app.get('/patient', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM patient');
    res.json(results);
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).send('Error fetching patients.');
  }
});

// Add a new patient
app.post('/patient', async (req, res) => {
  const { name, age, gender, dietType, roomNumber } = req.body;

  if (!name || !age || !gender || !dietType || !roomNumber) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO patient (name, age, gender, dietType, roomNumber) VALUES (?, ?, ?, ?, ?)',
      [name, age, gender, dietType, roomNumber]
    );
    res.status(201).json({
      message: 'Patient added successfully!',
      patient: { id: result.insertId, name, age, gender, dietType, roomNumber },
    });
  } catch (err) {
    console.error('Error adding patient:', err);
    res.status(500).send('Error adding patient.');
  }
});

// Delete a patient
app.delete('/patient/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM patient WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Patient not found.' });
    }

    res.status(200).json({ message: 'Patient deleted successfully!' });
  } catch (err) {
    console.error('Error deleting patient:', err);
    res.status(500).send('Error deleting patient.');
  }
});

// Update patient details
app.put('/patient/:id', async (req, res) => {
  const { id } = req.params;
  const { name, age, gender, dietType, roomNumber } = req.body;

  if (!name || !age || !gender || !dietType || !roomNumber) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const [result] = await db.query(
      'UPDATE patient SET name = ?, age = ?, gender = ?, dietType = ?, roomNumber = ? WHERE id = ?',
      [name, age, gender, dietType, roomNumber, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Patient not found.' });
    }

    res.status(200).json({ message: 'Patient updated successfully!' });
  } catch (err) {
    console.error('Error updating patient:', err);
    res.status(500).send('Error updating patient.');
  }
});

// Fetch all orders
app.get('/orders', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM orders');
    res.json(results);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).send('Error fetching orders.');
  }
});

// Add a new order
app.post('/orders', async (req, res) => {
  const { patientId, menuId, quantity, roomNumber, status } = req.body;

  if (!patientId || !menuId || !quantity || !roomNumber) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const [menuResult] = await db.query('SELECT price FROM menus WHERE id = ?', [menuId]);
    if (menuResult.length === 0) {
      return res.status(404).json({ error: 'Menu item not found.' });
    }

    const price = menuResult[0].price;
    const totalPrice = price * quantity;
    const orderStatus = status || 'Pending';

    const [result] = await db.query(
      'INSERT INTO orders (patientId, menuId, quantity, totalPrice,  status, roomNumber ) VALUES ( ?, ?, ?, ?, ?, ?)',
      [patientId, menuId, quantity, totalPrice, orderStatus, roomNumber]
    );

    res.status(201).json({
      message: 'Order placed successfully!',
      order: {
        id: result.insertId,
        patientId,
        menuId,
        quantity,
        totalPrice,
        roomNumber,
        status: orderStatus,
      },
    });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).send('Error placing order.');
  }
});

// Catch-all for serving React app from /myapp path
app.get('/myapp/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
