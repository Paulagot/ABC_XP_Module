import express from 'express';
import db from './config_db.js';

const UserCompletedMissionsRouter = express.Router();

// GET completed missions with additional data (new endpoint)
UserCompletedMissionsRouter.get('/completed_missions', (req, res) => {
    const { user_id } = req.query;

    const query = `
        SELECT 
            um.user_mission_id,
            um.user_id,
            um.mission_id,
            um.completion_date,
            u.first_name,  -- Fetch user's name
            m.name,  -- Fetch mission name
            m.xp  -- Fetch mission XP
        FROM 
            user_missions AS um
        JOIN users AS u ON um.user_id = u.user_id
        JOIN missions AS m ON um.mission_id = m.mission_id
        WHERE 
            um.user_id = ? AND um.completion_date IS NOT NULL
        ORDER BY um.completion_date DESC
        LIMIT 1;
    `;

    db.query(query, [user_id], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length > 0) {
            res.status(200).json(results[0]); // Return the most recent completed mission with details
        } else {
            res.status(404).json({ message: 'No completed missions found for this user' });
        }
    });
});

export default UserCompletedMissionsRouter;