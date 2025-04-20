// src/pages/ManagementDashboard.jsx
import { Link } from 'react-router-dom';
import '../styles/PatientDashboard.css'; // reuse same CSS for consistency

const ManagementDashboard = () => {
  return (
    <div className="patient-dashboard">
      <div className="dashboard-options">
        <Link to="/management/food-items" className="dash-card"> Manage Food Items </Link>
        <Link to="/management/orders" className="dash-card"> Handle Orders </Link>
        <Link to="/management/bills" className="dash-card"> Patient Billing </Link>
        <Link to="/management/inventory" className="dash-card"> Manage Inventory </Link>
      </div>
    </div>
  );
};

export default ManagementDashboard;
