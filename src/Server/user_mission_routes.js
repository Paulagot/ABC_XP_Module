import express from 'express';
import db from './config_db.js';

const UserMissionsRouter = express.Router();

// GET user mission status
UserMissionsRouter.get('/user_missions', (req, res) => {
    const { user_id } = req.query;

    const query = `
        SELECT 
            um.user_mission_id,
            um.user_id,
            um.mission_id,
            um.start_date,
            um.completion_date
        FROM 
            user_missions AS um
        WHERE 
            um.user_id = ? ;
    `;

    db.query(query, [user_id], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length > 0) {
            res.status(200).json(results); // Return all mission statuses for the user
        } else {
            // Return a custom message for no mission status found
            res.status(200).json([]);
        }
    });
});



export default UserMissionsRouter;
