// api/auth.js
import query from './db.js';
// We don't have bcrypt available easily in simple Vercel functions without complex setup, 
// so for a personal site we can use simple hashing or store password plainly (NOT RECOMMENDED for production environments with real users).
// Better approach: use a hardcoded token or simple password check since it's just you.
// For now, I will implement a simple password check against env var.

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'yourpassword'; // Set this in Vercel Env Vars

    if (req.method === 'POST') {
        const { action } = req.query;
        const { email, password } = req.body || {};

        if (action === 'login') {
            if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                // Return a fake token or session cookie logic
                // Since Vercel is serverless, maintaining session is tricky without JWT.
                // For simplicity, we'll return authorized: true and rely on client-side state for now,
                // securely you should use JWT.
                res.status(200).json({
                    success: true,
                    user: { email: ADMIN_EMAIL },
                    token: 'admin-token-placeholder'
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

    if (req.method === 'GET') {
        // Check "session" - strictly speaking this endpoint is stateless
        // But we can return success: false to prompt login on refresh
        res.status(200).json({ authenticated: false });
        return;
    }

    res.status(405).json({ error: 'Method not allowed' });
}
