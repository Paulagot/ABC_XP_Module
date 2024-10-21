import express from 'express';
import db from './config_db.js';  // Ensure this points to your actual db configuration

const WebhookMissionStatusRouter = express.Router();

// Webhook endpoint to handle byte enrollments and completions
WebhookMissionStatusRouter.post('/webhook/mission-status', async (req, res) => {
    const { user_id, course_id, enrol_date, completion_date } = req.body;

    if (!user_id || !course_id || !enrol_date) {
        return res.status(400).json({ error: 'user_id, course_id, and enrol_date are required' });
    }

    try {
        // Step 1: Retrieve mission_id from missions table using zenler_id
        const missionQuery = `
            SELECT mission_id, xp AS experience_points, subcategory_id, chain_id 
            FROM missions 
            WHERE zenler_id = ?
        `;
        const [missionDetails] = await db.promise().query(missionQuery, [course_id]);

        if (missionDetails.length === 0) {
            return res.status(404).json({ error: 'No matching mission found for the given course_id' });
        }

        const { mission_id, experience_points, subcategory_id, chain_id } = missionDetails[0];

        // Step 2: Check if a record already exists in user_missions for this user and mission
        const userMissionQuery = `
            SELECT user_mission_id FROM user_missions WHERE user_id = ? AND mission_id = ?
        `;
        const [userMission] = await db.promise().query(userMissionQuery, [user_id, mission_id]);

        if (userMission.length === 0) {
            // No existing record: Insert new enrollment with null completion_date
            const insertEnrollmentQuery = `
                INSERT INTO user_missions (user_id, mission_id, start_date, completion_date, created_at, updated_at)
                VALUES (?, ?, ?, NULL, NOW(), NOW())
            `;
            await db.promise().query(insertEnrollmentQuery, [user_id, mission_id, enrol_date]);
        } else if (completion_date) {
            // Existing record and completion_date provided: Update completion_date
            const updateCompletionQuery = `
                UPDATE user_missions
                SET completion_date = ?, updated_at = NOW()
                WHERE user_id = ? AND mission_id = ?
            `;
            await db.promise().query(updateCompletionQuery, [completion_date, user_id, mission_id]);

            // Step 3: Insert into user_missions_stats if the mission is completed
            const insertStatsQuery = `
                INSERT INTO xp_module.user_missions_stats (user_id, mission_id, subcategory_id, chain_id, experience_points)
                VALUES (?, ?, ?, ?, ?)
            `;
            await db.promise().query(insertStatsQuery, [
                user_id,
                mission_id,
                subcategory_id,
                chain_id,
                experience_points
            ]);
        }

        res.status(200).json({ message: 'User mission enrollment or completion processed successfully' });
    } catch (error) {
        console.error('Error processing mission webhook:', error);
        res.status(500).json({ error: 'Database error while processing mission webhook' });
    }
});


export default WebhookMissionStatusRouter;

