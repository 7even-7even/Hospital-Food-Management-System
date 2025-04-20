// src/pages/DietitianDashboard.jsx
import { Link } from 'react-router-dom';
import '../styles/PatientDashboard.css'; // using same style for consistency

const DietitianDashboard = () => {
  return (
    <div className="patient-dashboard">
      <div className="dashboard-options">
        <Link to="/dietitian/patients" className="dash-card"> View Patients </Link>
        <Link to="/dietitian/diet-plans" className="dash-card"> Add / Update Diet Plan </Link>
        <Link to="/dietitian/questions" className="dash-card"> Answer Patient Questions </Link>
      </div>
    </div>
  );
};

export default DietitianDashboard;
