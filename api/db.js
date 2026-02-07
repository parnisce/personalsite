// api/db.js
import mysql from 'mysql2/promise';

// Use environment variables for sensitive data
// OR fallback to hardcoded (less secure, but works for your personal site)
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'srv1518.hstgr.io',
    user: process.env.DB_USER || 'u323771957_cyrylprousr',
    password: process.env.DB_PASSWORD || 'yourpassword', // You need to set this in Vercel env vars
    database: process.env.DB_NAME || 'u323771957_cyrylprojectdb',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default async function query(sql, params) {
    const [rows, fields] = await pool.execute(sql, params);
    return rows;
}
