import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PatientList from './components/PatientList';
import MenuList from './components/MenuList';
import OrderList from './components/OrderList';
import OrderForm from './components/OrderForm';
import './styles.css';

function App() {
  // Define the base path for the app
  const basename = '/myapp';

  return (
    <Router basename={basename}>
    <h1>Hospital Food Management System</h1>
      <div className="App">
        <nav>
          <ul className='Nav-List'>
            <li className='listitem'>
              <Link to="/patients">Patients</Link>
            </li>
            <li className='listitem'>
              <Link to="/menu">Menu</Link>
            </li>
            <li className='listitem'>
              <Link to="/orders">Orders</Link>
            </li>
            <li className='listitem'>
              <Link to="/orderform">Place an Order</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/patients" element={<PatientList />} />
          <Route path="/menu" element={<MenuList />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/orderform" element={<OrderForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
