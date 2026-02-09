const query = require('./db.js');
const bcrypt = require('bcryptjs');

module.exports = async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { action } = req.query;

    try {
        if (req.method === 'GET' && action === 'check') {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(200).json({ authenticated: false });
            }

            const token = authHeader.split(' ')[1];
            try {
                // Dummy token check: base64 decodes to id:email:timestamp
                const decoded = Buffer.from(token, 'base64').toString('ascii');
                const [id, email, timestamp] = decoded.split(':');

                // Check if token is older than 24 hours
                if (Date.now() - parseInt(timestamp) > 24 * 60 * 60 * 1000) {
                    return res.status(200).json({ authenticated: false, message: 'Token expired' });
                }

                return res.status(200).json({
                    authenticated: true,
                    user: { id, email }
                });
            } catch (e) {
                return res.status(200).json({ authenticated: false });
            }
        }

        if (req.method === 'POST') {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'Email and password required' });
            }

            const rows = await query('SELECT * FROM admin_users WHERE email = ?', [email]);

            if (rows.length === 0) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const user = rows[0];
            const isValid = await bcrypt.compare(password, user.password_hash);

            if (isValid) {
                const token = Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString('base64');
                return res.status(200).json({
                    success: true,
                    token: token,
                    user: { id: user.id, email: user.email }
                });
            } else {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('Auth error:', error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
