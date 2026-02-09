const query = require('./db.js');
const bcrypt = require('bcryptjs');

module.exports = async function handler(req, res) {
    // Only allow this in development or with a secret key if you want to keep it
    // For now, let's just make it use the pool.

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Use GET for simplicity.' });
    }

    const { email, password, secret } = req.query;

    // Optional: add a secret check to prevent unauthorized use
    // if (secret !== process.env.ADMIN_PASSWORD) {
    //     return res.status(401).json({ error: 'Unauthorized' });
    // }

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password query params.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if user exists first
        const existing = await query('SELECT * FROM admin_users WHERE email = ?', [email]);

        if (existing.length > 0) {
            await query('UPDATE admin_users SET password_hash = ? WHERE email = ?', [hashedPassword, email]);
            return res.json({ success: true, message: 'User updated with new password.' });
        } else {
            // Insert
            await query('INSERT INTO admin_users (email, password_hash) VALUES (?, ?)', [email, hashedPassword]);
            return res.json({ success: true, message: 'User created successfully.' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};
