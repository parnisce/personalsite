// api/projects.js
const query = require('./db.js');

module.exports = async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        if (req.method === 'GET') {
            const projects = await query('SELECT * FROM projects ORDER BY created_at DESC');
            res.status(200).json(projects);
            return;
        }

        // --- AUTHENTICATION CHECK ---
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: Missing token' });
        }

        const token = authHeader.split(' ')[1];
        try {
            const decoded = Buffer.from(token, 'base64').toString('ascii');
            const [id, email, timestamp] = decoded.split(':');

            // Check if token is older than 24 hours
            if (Date.now() - parseInt(timestamp) > 24 * 60 * 60 * 1000) {
                return res.status(401).json({ error: 'Unauthorized: Token expired' });
            }
        } catch (e) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token format' });
        }
        // -----------------------------

        if (req.method === 'POST') {
            const { title, short_description, description, tech_stack, image_url, link, category, badges } = req.body;

            if (!title) return res.status(400).json({ error: 'Title is required' });

            const result = await query(
                `INSERT INTO projects (title, short_description, description, tech_stack, image_url, link, category, badges) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [title, short_description, description, tech_stack, image_url, link, category, badges]
            );

            res.status(201).json({ success: true, id: result.insertId });
            return;
        }

        if (req.method === 'PUT') {
            const { id, title, short_description, description, tech_stack, image_url, link, category, badges } = req.body;

            await query(
                `UPDATE projects SET title=?, short_description=?, description=?, tech_stack=?, image_url=?, link=?, category=?, badges=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
                [title, short_description, description, tech_stack, image_url, link, category, badges, id]
            );

            res.status(200).json({ success: true });
            return;
        }

        if (req.method === 'DELETE') {
            const { id } = req.query;
            if (!id) return res.status(400).json({ error: 'ID is required' });

            await query('DELETE FROM projects WHERE id = ?', [id]);
            res.status(200).json({ success: true });
            return;
        }

        res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
