// api/test.js
const mysql = require('mysql2/promise');

module.exports = async function handler(req, res) {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'srv1518.hstgr.io',
            user: process.env.DB_USER || 'u323771957_cyrylprousr',
            password: process.env.DB_PASSWORD || 'yourpassword', // Vercel ENV VAR takes priority
            database: process.env.DB_NAME || 'u323771957_cyrylprojectdb',
            port: 3306 // Standard MySQL port
        });

        await connection.end();
        res.status(200).json({ success: true, message: 'Database Connection Successful!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Database Connection Failed',
            error: error.message,
            code: error.code
        });
    }
};
