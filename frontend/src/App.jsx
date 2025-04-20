import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/patientDashboard';
import DietitianDashboard from './pages/DietitianDashboard';
import ManagementDashboard from './pages/ManagementDashboard';
import FoodItems from './components/FoodItems';
import MyDietPlan from './components/MyDietPlan';
import AskQuestion from './components/AskQuestion';
import Profile from './components/Profile';
import ManageOrder from './components/ManageOrder';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 💡 Nest patient pages under dashboard layout */}
        <Route path="/patient" element={<PatientDashboard />}>
          <Route path="profile" element={<Profile />} />
          <Route path="food-items" element={<FoodItems />} />
          <Route path="diet-plan" element={<MyDietPlan />} />
          <Route path="ask-question" element={<AskQuestion />} />
          <Route path="manage" element={<ManageOrder />} />
        </Route>

        <Route path="/dietitian/dashboard" element={<DietitianDashboard />} />
        <Route path="/management/dashboard" element={<ManagementDashboard />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
