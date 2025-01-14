const mysql = require('mysql2/promise'); // Using promise-based API

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Sid@*963.',
  database: 'hospital_food_management',
  waitForConnections: true,
  connectionLimit: 10,  // Number of connections to allow in the pool
  queueLimit: 0         // No limit on the queue of waiting connections
});

module.exports = pool; // Export the pool
