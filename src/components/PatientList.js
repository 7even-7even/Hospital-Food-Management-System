import React, { useState, useEffect } from 'react';
import './compstyle.css'; // Assuming CSS styles are stored here

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: '', dietType: '', roomNumber: '' });
  const [editPatient, setEditPatient] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:5000/patient');
      if (!response.ok) throw new Error('Failed to fetch patients');
      const data = await response.json();
      setPatients(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddPatient = async () => {
    setMessage(null);
    setError(null);
    console.log('Adding patient:', newPatient);
    try {
      const response = await fetch('http://localhost:5000/patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPatient),
      });
      if (!response.ok) throw new Error('Failed to add patient');
      setMessage('Patient added successfully!');
      setNewPatient({ name: '', age: '', gender: '', dietType: '', roomNumber: '' });
      fetchPatients();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeletePatient = async (id) => {
    setMessage(null);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/patient/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete patient');
      setMessage('Patient deleted successfully!');
      fetchPatients();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdatePatient = async () => {
    setMessage(null);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/patient/${editPatient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editPatient),
      });
      if (!response.ok) throw new Error('Failed to update patient');
      setMessage('Patient updated successfully!');
      setEditPatient(null);
      fetchPatients();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="patient-container">
      <h2>Patient List</h2>
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
      <ul>
        {patients.map((patient) => (
          <li key={patient.id}>
            <span>{patient.name} </span>- {patient.age} - {patient.gender} - {patient.dietType} - {patient.roomNumber}
            <br></br>
            <button onClick={() => handleDeletePatient(patient.id)}>Delete</button>
            <button onClick={() => setEditPatient(patient)}>Edit</button>
          </li>
        ))}
      </ul>

      <h3>Add New Patient</h3>
      <br></br>
      <input
        type="text"
        placeholder="Name"
        value={newPatient.name}
        onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Age"
        value={newPatient.age}
        onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
      />
      <input
        type="text"
        placeholder="Gender"
        value={newPatient.gender}
        onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
      />
      <input
        type="text"
        placeholder="Diet Type"
        value={newPatient.dietType}
        onChange={(e) => setNewPatient({ ...newPatient, dietType: e.target.value })}
      />
      <input
        type="text"
        placeholder="Room Number"
        value={newPatient.roomNumber}
        onChange={(e) => setNewPatient({ ...newPatient, roomNumber: e.target.value })}
      />
      <button onClick={handleAddPatient}>Add Patient</button>

      {editPatient && (
        <div>
          <h3>Edit Patient</h3>
          <br></br>
          <input
            type="text"
            placeholder="Name"
            value={editPatient.name}
            onChange={(e) => setEditPatient({ ...editPatient, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Age"
            value={editPatient.age}
            onChange={(e) => setEditPatient({ ...editPatient, age: e.target.value })}
          />
          <input
            type="text"
            placeholder="Gender"
            value={editPatient.gender}
            onChange={(e) => setEditPatient({ ...editPatient, gender: e.target.value })}
          />
          <input
            type="text"
            placeholder="Diet Type"
            value={editPatient.dietType}
            onChange={(e) => setEditPatient({ ...editPatient, dietType: e.target.value })}
          />
          <input
            type="text"
            placeholder="Room Number"
            value={editPatient.roomNumber}
            onChange={(e) => setEditPatient({ ...editPatient, roomNumber: e.target.value })}
          />
          <button onClick={handleUpdatePatient}>Update Patient</button>
        </div>
      )}
    </div>
  );
}

export default PatientList;
