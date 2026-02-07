// api/auth.js
const query = require('./db.js');

module.exports = async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'yourpassword';

    // Verify token for check action
    if (req.method === 'GET' || (req.method === 'POST' && req.query.action === 'check')) {
        const authHeader = req.headers.authorization;
        if (authHeader === `Bearer ${ADMIN_PASSWORD}`) {
            res.status(200).json({
                authenticated: true,
                user: { email: ADMIN_EMAIL }
            });
            return;
        }
        res.status(200).json({ authenticated: false });
        return;
    }

    if (req.method === 'POST') {
        const { action } = req.query;
        // Handle body parsing if needed (Vercel usually does this automatically)
        const { email, password } = req.body || {};

        if (action === 'login') {
            if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                // Return the password as the token (simple approach for personal site)
                res.status(200).json({
                    success: true,
                    user: { email: ADMIN_EMAIL },
                    token: ADMIN_PASSWORD
                });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
            return;
        }

        if (action === 'logout') {
            res.status(200).json({ success: true });
            return;
        }
    }

    res.status(405).json({ error: 'Method not allowed' });
};
