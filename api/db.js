// api/db.js
const mysql = require('mysql2/promise');

// Use environment variables for sensitive data
// OR fallback to hardcoded (less secure, but works for your personal site)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = async function query(sql, params) {
    const [rows, fields] = await pool.execute(sql, params);
    return rows;
};
