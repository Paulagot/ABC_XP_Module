// userProfile.js

import express from 'express';
import db from './config_db.js'; // Replace with your actual database configuration

const userProfileRouter = express.Router();

// Route to fetch user profile data, including progress and LP accumulation
userProfileRouter.get('/profile', async (req, res) => {
    const userId = req.query.userId; // Get userId from query parameter

    try {
        // Fetch user data
        const [userResult] = await db.promise().query(
            "SELECT user_id, first_name AS name FROM users WHERE user_id = ?",
            [userId]
        );
        const user = userResult[0];

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Fetch progress data by subcategory and level
        const [progressResult] = await db.promise().query(`
            SELECT 
                subcategory_id,
                category_id AS level,  -- 'category_id' is used as the level in your table
                COUNT(*) AS total_bytes,
                SUM(CASE WHEN learning_points > 0 THEN 1 ELSE 0 END) AS completed_bytes
            FROM 
                user_bytes_stats
            WHERE 
                user_id = ?
            GROUP BY 
                subcategory_id, category_id
        `, [userId]);

        // Structure progress data
        const progress = progressResult.reduce((acc, row) => {
            const { subcategory_id, level, total_bytes, completed_bytes } = row;

            // Check if subcategory already exists in accumulator
            let subcategory = acc.find(sc => sc.subcategory_id === subcategory_id);
            if (!subcategory) {
                subcategory = { subcategory_id, levels: [] };
                acc.push(subcategory);
            }

            // Push level data into the respective subcategory
            subcategory.levels.push({ level, completed_bytes, total_bytes });
            return acc;
        }, []);

        // Fetch LP accumulation data with target LP
        const [lpResult] = await db.promise().query(`
            SELECT 
                ubs.subcategory_id,
                SUM(ubs.learning_points) AS current_lp,
                st.target_lp
            FROM 
                user_bytes_stats ubs
            JOIN 
                subcategory_targets st ON ubs.subcategory_id = st.subcategory_id
            WHERE 
                ubs.user_id = ?
            GROUP BY 
                ubs.subcategory_id
        `, [userId]);

        // Structure LP data
        const lpAccumulation = lpResult.map(row => ({
            subcategory_id: row.subcategory_id,
            current_lp: row.current_lp,
            target_lp: row.target_lp
        }));

        // Respond with structured data
        res.json({ user, progress, lpAccumulation });
    } catch (error) {
        console.error("Error fetching user profile data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default userProfileRouter;
