const express = require('express');
const router = express.Router();
const db = require('../db'); // Database connection

// Fetch all patients
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM patient');
    res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching patients:', err.message);
    res.status(500).json({ error: 'Failed to fetch patients.' });
  }
});


// Add a new patient
router.post('/', async (req, res) => {
  const { name, age, gender, dietType, roomNumber } = req.body;

  // Validate input
  if (!name || !age || !gender || !dietType || !roomNumber) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO patient (name, age, gender, dietType, roomNumber) VALUES (?, ?, ?, ?, ?)',
      [name, age, gender, dietType, roomNumber]
    );
    res.status(201).json({
      message: 'Patient added successfully.',
      patient: { id: result.insertId, name, age, gender, dietType, roomNumber },
    });
  } catch (err) {
    console.error('Error adding patient:', err.message);
    res.status(500).json({ error: 'Failed to add patient.' });
  }
});

// Update patient details
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, age, gender, dietType, roomNumber } = req.body;

  // Validate input
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

    res.status(200).json({
      message: 'Patient updated successfully.',
      patient: { id, name, age, gender, dietType, roomNumber },
    });
  } catch (err) {
    console.error('Error updating patient:', err.message);
    res.status(500).json({ error: 'Failed to update patient.' });
  }
});

// Delete a patient
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM patient WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Patient not found.' });
    }

    res.status(200).json({ message: 'Patient deleted successfully.' });
  } catch (err) {
    console.error('Error deleting patient:', err.message);
    res.status(500).json({ error: 'Failed to delete patient.' });
  }
});

module.exports = router;
