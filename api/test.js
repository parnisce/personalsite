const query = require('./db.js');

module.exports = async function handler(req, res) {
    try {
        // Simple query to test connection
        const rows = await query('SELECT 1 + 1 AS result');

        res.status(200).json({
            success: true,
            message: 'Database Connection Successful!',
            db_host: process.env.DB_HOST,
            result: rows[0].result
        });

    } catch (error) {
        console.error('Test DB Connection Error:', error);
        res.status(500).json({
            success: false,
            message: 'Database Connection Failed',
            error: error.message,
            code: error.code,
            db_host: process.env.DB_HOST
        });
    }
};
