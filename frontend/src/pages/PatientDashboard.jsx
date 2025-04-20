import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../styles/PatientDashboard.css';
import Profile from '../assets/Profile.png';
import Food from '../assets/Food.png';
import Diet from '../assets/Diet.png';
import Ask from '../assets/Ask.png';
import Manage from '../assets/Manage.png';

const cardData = [
  { path: "profile", label: "Profile", img: Profile },
  { path: "food-items", label: "View Food Items", img: Food },
  { path: "diet-plan", label: "My Diet Plan", img: Diet },
  { path: "ask-question", label: "Ask a Dietitian", img: Ask },
  { path: "manage", label: "Manage Orders", img: Manage },
];

const PatientDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarActive, setSidebarActive] = useState(false);

  useEffect(() => {
    setSidebarActive(location.pathname !== "/patient");
  }, [location.pathname]);

  const handleDashboardClick = () => {
    navigate('/patient');
    setSidebarActive(false);
  };

  return (
    <div className={`dashboard ${sidebarActive ? 'with-sidebar' : ''}`}>
      {sidebarActive && (
        <div className="sidebar">
          <div className="sidebar-item dashboard-back" onClick={handleDashboardClick}>
            <span>Dashboard</span>
          </div>
          {cardData.map((card, index) => (
            <Link
              to={`/patient/${card.path}`}
              key={index}
              className={`sidebar-item ${location.pathname === `/patient/${card.path}` ? 'active' : ''}`}
            >
              <img src={card.img} alt={card.label} className="sidebar-icon" />
              <span>{card.label}</span>
            </Link>
          ))}
        </div>
      )}

      <div className="dashboard-content">
        {!sidebarActive ? (
          <>
            <h1 className="dashboard-title">Welcome to Your Dashboard</h1>
            <div className="dashboard-grid">
              {cardData.map((card, index) => (
                <div
                  className="dashboard-card"
                  key={index}
                  onClick={() => navigate(`/patient/${card.path}`)}
                >
                  <img src={card.img} alt={card.label} className="dashboard-icon" />
                  <h3>{card.label}</h3>
                </div>
              ))}
            </div>
          </>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
