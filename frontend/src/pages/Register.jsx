import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Register.css'; // 💅 Scoped CSS

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    age: '',
    gender: '',
    weight: '',
    height: '',
    medicalConditions: '',
    assignedDietitian: '',
    specialization: '',
    experience: '',
    qualifications: '',
    department: '',
    contactNumber: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match!");
    }

    try {
      const userData = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      };

      if (form.role === 'patient') {
        Object.assign(userData, {
          age: form.age,
          gender: form.gender,
          weight: form.weight,
          height: form.height,
          medicalConditions: form.medicalConditions,
          assignedDietitian: form.assignedDietitian || null,
        });
      } else if (form.role === 'dietitian') {
        Object.assign(userData, {
          specialization: form.specialization,
          experience: form.experience,
          qualifications: form.qualifications,
        });
      } else if (form.role === 'management') {
        Object.assign(userData, {
          department: form.department,
          contactNumber: form.contactNumber,
        });
      }

      await axios.post("http://localhost:5000/api/auth/register", userData);

      alert("✅ Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="register-wrapper">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <p className="register-error">{error}</p>}

        <div className="input-grid">
          <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        </div>

        <div className="input-grid">
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
        </div>

        <select name="role" value={form.role} onChange={handleChange} required>
          <option value="patient">Patient</option>
          <option value="dietitian">Dietitian</option>
          <option value="management">Management</option>
        </select>

        {/* 🎯 Patient */}
        {form.role === 'patient' && (
          <>
            <div className="input-grid">
              <input type="number" name="age" placeholder="Age" value={form.age} onChange={handleChange} />
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="input-grid">
              <input type="number" name="weight" placeholder="Weight (kg)" value={form.weight} onChange={handleChange} />
              <input type="number" name="height" placeholder="Height (cm)" value={form.height} onChange={handleChange} />
            </div>

            <textarea name="medicalConditions" placeholder="Medical Conditions" value={form.medicalConditions} onChange={handleChange}></textarea>
            <input type="text" name="assignedDietitian" placeholder="Assigned Dietitian (optional)" value={form.assignedDietitian} onChange={handleChange} />
          </>
        )}

        {/* 🎯 Dietitian */}
        {form.role === 'dietitian' && (
          <div className="input-grid">
            <input type="text" name="specialization" placeholder="Specialization" value={form.specialization} onChange={handleChange} />
            <input type="text" name="experience" placeholder="Experience (in years)" value={form.experience} onChange={handleChange} />
            <input type="text" name="qualifications" placeholder="Qualifications" value={form.qualifications} onChange={handleChange} />
          </div>
        )}

        {/* 🎯 Management */}
        {form.role === 'management' && (
          <div className="input-grid">
            <input type="text" name="department" placeholder="Department" value={form.department} onChange={handleChange} />
            <input type="text" name="contactNumber" placeholder="Contact Number" value={form.contactNumber} onChange={handleChange}/>
          </div>
        )}

        <button type="submit">Register</button>
        <p className="auth-links">Already have an account? <Link to="/">Login</Link></p>
      </form>
    </div>
  );
};

export default Register;
