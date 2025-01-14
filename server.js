const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db.js'); // Import the database connection

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React app (Build folder)
app.use('/myapp', express.static(path.join(__dirname, 'build')));

//fetch patients
app.get('/patient', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM patient');
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching patients.');
  }
});

//adding patient
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
    console.error(err);
    res.status(500).send('Error adding patient.');
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
    console.error(err);
    res.status(500).send('Error updating patient.');
  }
});

//deleting patient
app.delete('/patient/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM patient WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Patient not found.' });
    }

    res.status(200).json({ message: 'Patient deleted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting patient.');
  }
});


// Fetch all menus
app.get('/menus', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM menus');
    res.json(results);
  } catch (err) {
    console.error(err);
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
    console.error(err);
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
    console.error(err);
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
    console.error(err);
    res.status(500).send('Error deleting menu item.');
  }
});

// Fetch all patients
app.get('/patient', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM patient');
    res.json(results);
  } catch (err) {
    console.error(err);
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
    console.error(err);
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
    console.error(err);
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
    console.error(err);
    res.status(500).send('Error updating patient.');
  }
});

// Other Routes for Orders (unchanged)
app.get('/orders', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM orders');
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching orders.');
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
