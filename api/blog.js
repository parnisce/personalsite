// api/blog.js
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
            const { slug } = req.query;
            if (slug) {
                const posts = await query('SELECT * FROM blog_posts WHERE slug = ?', [slug]);
                if (posts.length === 0) return res.status(404).json({ error: 'Post not found' });
                res.status(200).json(posts[0]);
            } else {
                const posts = await query('SELECT * FROM blog_posts ORDER BY published_at DESC');
                res.status(200).json(posts);
            }
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

            if (Date.now() - parseInt(timestamp) > 24 * 60 * 60 * 1000) {
                return res.status(401).json({ error: 'Unauthorized: Token expired' });
            }
        } catch (e) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token format' });
        }
        // -----------------------------

        if (req.method === 'POST') {
            const { title, slug, excerpt, content, image_url, category } = req.body;

            if (!title || !slug) return res.status(400).json({ error: 'Title and Slug are required' });

            const result = await query(
                `INSERT INTO blog_posts (title, slug, excerpt, content, image_url, category) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [title, slug, excerpt, content, image_url, category]
            );

            res.status(201).json({ success: true, id: result.insertId });
            return;
        }

        if (req.method === 'PUT') {
            const { id, title, slug, excerpt, content, image_url, category } = req.body;

            await query(
                `UPDATE blog_posts SET title=?, slug=?, excerpt=?, content=?, image_url=?, category=? WHERE id=?`,
                [title, slug, excerpt, content, image_url, category, id]
            );

            res.status(200).json({ success: true });
            return;
        }

        if (req.method === 'DELETE') {
            const { id } = req.query;
            if (!id) return res.status(400).json({ error: 'ID is required' });

            await query('DELETE FROM blog_posts WHERE id = ?', [id]);
            res.status(200).json({ success: true });
            return;
        }

        res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
