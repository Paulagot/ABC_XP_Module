import express from 'express'
import db from './config_db.js'; // Make sure this is your database configuration



const leaderboardRouter = express.Router();

// Leaderboard API Endpoint
leaderboardRouter.get('/leaderboard', async (req, res) => {
    const userId = parseInt(req.query.userId, 10);

    try {
        const leaderboardQuery = `
            SELECT 
                u.user_id,
                u.first_name AS user_name,
                (SELECT COALESCE(SUM(learning_points), 0) 
                 FROM user_bytes_stats 
                 WHERE user_id = u.user_id 
                   AND MONTH(created_at) = MONTH(CURRENT_DATE())
                   AND YEAR(created_at) = YEAR(CURRENT_DATE())) AS learning_points,
                (SELECT COALESCE(SUM(experience_points), 0) 
                 FROM user_missions_stats 
                 WHERE user_id = u.user_id 
                   AND MONTH(created_at) = MONTH(CURRENT_DATE())
                   AND YEAR(created_at) = YEAR(CURRENT_DATE())) AS experience_points,
                ((SELECT COALESCE(SUM(learning_points), 0) 
                  FROM user_bytes_stats 
                  WHERE user_id = u.user_id 
                    AND MONTH(created_at) = MONTH(CURRENT_DATE())
                    AND YEAR(created_at) = YEAR(CURRENT_DATE())) + 
                 (SELECT COALESCE(SUM(experience_points), 0) 
                  FROM user_missions_stats 
                  WHERE user_id = u.user_id 
                    AND MONTH(created_at) = MONTH(CURRENT_DATE())
                    AND YEAR(created_at) = YEAR(CURRENT_DATE()))) AS total_points
            FROM users u
            WHERE ((SELECT COALESCE(SUM(learning_points), 0) 
                    FROM user_bytes_stats 
                    WHERE user_id = u.user_id 
                      AND MONTH(created_at) = MONTH(CURRENT_DATE())
                      AND YEAR(created_at) = YEAR(CURRENT_DATE())) + 
                   (SELECT COALESCE(SUM(experience_points), 0) 
                    FROM user_missions_stats 
                    WHERE user_id = u.user_id 
                      AND MONTH(created_at) = MONTH(CURRENT_DATE())
                      AND YEAR(created_at) = YEAR(CURRENT_DATE()))) > 0
            ORDER BY total_points DESC
            LIMIT 20;
        `;

        const [leaderboard] = await db.promise().query(leaderboardQuery);

        // Find rank and data for the specified userId
        let userRank = null;
        let userData = null;

        if (userId) {
            const userIndex = leaderboard.findIndex(user => user.user_id === userId);
            if (userIndex !== -1) {
                userRank = userIndex + 1;
                userData = leaderboard[userIndex];
            }
        }

        res.json({ leaderboard, userRank, userData });
    } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default leaderboardRouter;
