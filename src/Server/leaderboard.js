import express from 'express'
import db from './config_db.js'; // Make sure this is your database configuration
import cron from 'node-cron';

const leaderboardRouter = express.Router();

// Leaderboard API Endpoint
leaderboardRouter.get('/leaderboard', async (req, res) => {
    const userId = parseInt(req.query.userId, 10);

    try {
        const leaderboardQuery = `
            SELECT 
                u.user_id,
                u.first_name AS user_name,
                (SELECT COALESCE(SUM(learning_points), 0) FROM user_bytes_stats WHERE user_id = u.user_id) AS learning_points,
                (SELECT COALESCE(SUM(experience_points), 0) FROM user_missions_stats WHERE user_id = u.user_id) AS experience_points,
                ((SELECT COALESCE(SUM(learning_points), 0) FROM user_bytes_stats WHERE user_id = u.user_id) + 
                 (SELECT COALESCE(SUM(experience_points), 0) FROM user_missions_stats WHERE user_id = u.user_id)) AS total_points
            FROM users u
            WHERE ((SELECT COALESCE(SUM(learning_points), 0) FROM user_bytes_stats WHERE user_id = u.user_id) + 
                   (SELECT COALESCE(SUM(experience_points), 0) FROM user_missions_stats WHERE user_id = u.user_id)) > 0
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



// Weekly Reset Cron Job - Runs every Sunday at midnight
cron.schedule('0 0 * * 0', async () => {
    try {
        // Reset points in user_bytes_stats and user_missions_stats tables at the start of each week
        const resetQueryBytes = `UPDATE user_bytes_stats SET learning_points = 0, updated_at = NOW()`;
        const resetQueryMissions = `UPDATE user_missions_stats SET experience_points = 0, updated_at = NOW()`;
        
        await db.promise().query(resetQueryBytes);
        await db.promise().query(resetQueryMissions);

        console.log("Leaderboard points reset successfully at the start of the week.");
    } catch (error) {
        console.error("Error resetting leaderboard points:", error);
    }
});

export default leaderboardRouter;
