// api/auth.js
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

module.exports = async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'srv1518.hstgr.io',
            user: process.env.DB_USER || 'u323771957_cyrylprousr',
            password: process.env.DB_PASSWORD, // Must be set in Vercel Env Vars
            database: process.env.DB_NAME || 'u323771957_cyrylprojectdb'
        });

        // Check if user exists
        const [rows] = await connection.execute(
            'SELECT * FROM admin_users WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = rows[0];
        // Compare password with hash
        const isValid = await bcrypt.compare(password, user.password_hash);

        if (isValid) {
            // Generate a simple token (in production use JWT, here we use a dummy token for simplicity)
            // Ideally, store session in DB or use JWT. For this quick migration:
            const token = Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString('base64');

            return res.status(200).json({
                success: true,
                token: token,
                user: { id: user.id, email: user.email }
            });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ success: false, message: 'Database error', error: error.message });
    } finally {
        if (connection) await connection.end();
    }
};
