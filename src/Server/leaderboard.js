import express from 'express'
import pool from './config_db.js'; // Make sure this is your database configuration



const leaderboardRouter = express.Router();

leaderboardRouter.get('/lifetime-rank', async (req, res) => {
    const userId = Number.parseInt(req.query.userId);
    
    try {
        const rankQuery = `
            WITH UserPoints AS (
                SELECT 
                    u.user_id,
                    u.first_name AS user_name,
                    COALESCE(SUM(ubs.learning_points), 0) as learning_points,
                    COALESCE(SUM(ums.experience_points), 0) as experience_points,
                    COALESCE(SUM(ubs.learning_points), 0) + COALESCE(SUM(ums.experience_points), 0) as total_points
                FROM users u
                LEFT JOIN user_bytes_stats ubs ON u.user_id = ubs.user_id
                LEFT JOIN user_missions_stats ums ON u.user_id = ums.user_id
                GROUP BY u.user_id, u.first_name
                HAVING COALESCE(SUM(ubs.learning_points), 0) + COALESCE(SUM(ums.experience_points), 0) > 0
            )
            SELECT *
            FROM UserPoints
            ORDER BY total_points DESC;
        `;
        
        const [results] = await pool.promise().query(rankQuery);
        
        let userRank = null;
        let userData = null;
        let firstRankTotal = results.length > 0 ? results[0].total_points : 0;
        let userDifference = null;

        if (userId) {
            const userIndex = results.findIndex(user => user.user_id === userId);
            if (userIndex !== -1) {
                userRank = userIndex + 1;
                userData = results[userIndex];
                userDifference = firstRankTotal - userData.total_points;
            }
        }

        // Fetch the points for specific rank positions and calculate the differences
        const rankPositions = [1, 3, 5, 10, 20, 50, 100];
        const rankComparisons = {};

        for (const pos of rankPositions) {
            if (results.length >= pos) {
                const rankTotal = results[pos - 1].total_points;
                const rankDifference = userData ? rankTotal - userData.total_points : null;

                rankComparisons[`rank_${pos}`] = {
                    total_points: rankTotal,
                    difference: rankDifference
                };
            } else {
                rankComparisons[`rank_${pos}`] = {
                    total_points: null,
                    difference: null
                };
            }
        }

        res.json({ 
            userRank, 
            userData, 
            firstRankTotal, 
            userDifference, 
            rankComparisons, 
            results 
        });
    } catch (error) {
        console.error("Error fetching lifetime rank data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Leaderboard API Endpoint
leaderboardRouter.get('/leaderboard', async (req, res) => {
    const userId = Number.parseInt(req.query.userId);

    try {
        const leaderboardQuery = `
               SELECT 
                u.user_id,
                u.first_name AS user_name,
                (SELECT COALESCE(SUM(learning_points), 0) 
                 FROM user_bytes_stats 
                 WHERE user_id = u.user_id 
                   AND created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)) AS learning_points,
                (SELECT COALESCE(SUM(experience_points), 0) 
                 FROM user_missions_stats 
                 WHERE user_id = u.user_id 
                   AND created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)) AS experience_points,
                ((SELECT COALESCE(SUM(learning_points), 0) 
                  FROM user_bytes_stats 
                  WHERE user_id = u.user_id 
                    AND created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)) + 
                 (SELECT COALESCE(SUM(experience_points), 0) 
                  FROM user_missions_stats 
                  WHERE user_id = u.user_id 
                    AND created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))) AS total_points
            FROM users u
            WHERE ((SELECT COALESCE(SUM(learning_points), 0) 
                    FROM user_bytes_stats 
                    WHERE user_id = u.user_id 
                      AND created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)) + 
                   (SELECT COALESCE(SUM(experience_points), 0) 
                    FROM user_missions_stats 
                    WHERE user_id = u.user_id 
                      AND created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))) > 0
            ORDER BY total_points DESC
            LIMIT 20;
        `;

        const [leaderboard] = await pool.promise().query(leaderboardQuery);

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
