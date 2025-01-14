// src/MenuList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './compstyle.css';

const MenuList = () => {
  const [menus, setMenus] = useState([]);
  const [newMenu, setNewMenu] = useState({ name: '', description: '', price: '' });
  const [editMenu, setEditMenu] = useState(null);

  // Fetch menu items from the API
  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = () => {
    axios.get('http://localhost:5000/menus')
      .then(response => {
        setMenus(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the menus!', error);
      });
  };

  // Add a new menu item
  const handleAddMenu = () => {
    axios.post('http://localhost:5000/menus', newMenu)
      .then(() => {
        fetchMenus();
        setNewMenu({ name: '', description: '', price: '' });
      })
      .catch(error => {
        console.error('Error adding menu:', error);
      });
  };

  // Update a menu item
  const handleUpdateMenu = () => {
    axios.put(`http://localhost:5000/menus/${editMenu.id}`, editMenu)
      .then(() => {
        fetchMenus();
        setEditMenu(null);
      })
      .catch(error => {
        console.error('Error updating menu:', error);
      });
  };

  // Delete a menu item
  const handleDeleteMenu = (id) => {
    axios.delete(`http://localhost:5000/menus/${id}`)
      .then(() => {
        fetchMenus();
      })
      .catch(error => {
        console.error('Error deleting menu:', error);
      });
  };

  return (
    <div className="menu-container">
      <h2 className="menu-header">Menu List</h2>

      {/* Add New Menu */}
      <div className="add-menu">
        <h3>Add Menu Item</h3>
        <input
          type="text"
          placeholder="Name"
          value={newMenu.name}
          onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newMenu.description}
          onChange={(e) => setNewMenu({ ...newMenu, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newMenu.price}
          onChange={(e) => setNewMenu({ ...newMenu, price: e.target.value })}
        />
        <button onClick={handleAddMenu}>Add Menu</button>
      </div>

      {/* List Menus */}
      <ul className="menu-list">
        {menus.map(menu => (
          <li className="menu-item" key={menu.id}>
            {editMenu && editMenu.id === menu.id ? (
              <div className="edit-menu">
                <input
                  type="text"
                  value={editMenu.name}
                  onChange={(e) => setEditMenu({ ...editMenu, name: e.target.value })}
                />
                <input
                  type="text"
                  value={editMenu.description}
                  onChange={(e) => setEditMenu({ ...editMenu, description: e.target.value })}
                />
                <input
                  type="number"
                  value={editMenu.price}
                  onChange={(e) => setEditMenu({ ...editMenu, price: e.target.value })}
                />
                <br></br>
                <button onClick={handleUpdateMenu}>Save</button>
                <button onClick={() => setEditMenu(null)}>Cancel</button>
              </div>
            ) : (
              <>
                <span>{menu.name}</span> - {menu.description} - Rs.{menu.price}
                <br></br>
                <button onClick={() => setEditMenu(menu)}>Edit</button>
                <button onClick={() => handleDeleteMenu(menu.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuList;
