// api/create_admin.js
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

module.exports = async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Use GET for simplicity.' });
    }

    const { email, password } = req.query;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password query params.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'srv1518.hstgr.io',
            user: process.env.DB_USER || 'u323771957_cyrylprousr',
            password: process.env.DB_PASSWORD, // Must be set in Vercel Env Vars
            database: process.env.DB_NAME || 'u323771957_cyrylprojectdb'
        });

        // Check if user exists first
        const [existing] = await connection.execute('SELECT * FROM admin_users WHERE email = ?', [email]);
        if (existing.length > 0) {
            await connection.execute('UPDATE admin_users SET password_hash = ? WHERE email = ?', [hashedPassword, email]);
            await connection.end();
            return res.json({ success: true, message: 'User updated with new password.' });
        } else {
            // Insert
            await connection.execute('INSERT INTO admin_users (email, password_hash) VALUES (?, ?)', [email, hashedPassword]);
            await connection.end();
            return res.json({ success: true, message: 'User created successfully.' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};
