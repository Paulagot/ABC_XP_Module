import express from 'express';
import pool from './config_db.js';


const UserBytesRouter = express.Router();

UserBytesRouter.get('/user_bytes', (req, res) => {
    const { user_id } = req.query;

    const query = `
        SELECT 
            ub.user_course_id, 
            ub.user_id, 
            ub.bite_id, 
            ub.enrol_date,
            ub.start_date,
            ub.completion_date, 
            ub.created_at,
            ub.updated_at,
            b.points AS lp_value, 
            b.subcategory_id,
            b.landing_page_url -- Include landing_page_url
        FROM 
            user_bytes AS ub
        JOIN 
            bites AS b ON ub.bite_id = b.bite_id
        WHERE 
            ub.user_id = ?;
    `;

    pool.query(query, [user_id], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
    });
});

export default UserBytesRouter;