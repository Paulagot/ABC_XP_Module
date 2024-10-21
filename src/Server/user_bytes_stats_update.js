import express from 'express';
import db from './config_db.js';  // Ensure this points to your actual db configuration

const WebhookByteStatusRouter = express.Router();

// Webhook endpoint to handle byte enrollments and completions
WebhookByteStatusRouter.post('/webhook/byte-status', async (req, res) => {
    const { user_id, course_id, enrol_date, completion_date } = req.body;

    if (!user_id || !course_id || !enrol_date) {
        return res.status(400).json({ error: 'user_id, course_id, and enrol_date are required' });
    }

    try {
        // Step 1: Retrieve bite_id from bites table using zenler_id
        const biteQuery = `
            SELECT bite_id, points AS learning_points, category_id, subcategory_id 
            FROM bites 
            WHERE zenler_id = ?
        `;
        const [biteDetails] = await db.promise().query(biteQuery, [course_id]);

        if (biteDetails.length === 0) {
            return res.status(404).json({ error: 'No matching bite found for the given course_id' });
        }

        const { bite_id, learning_points, category_id, subcategory_id } = biteDetails[0];

        // Step 2: Check if a record already exists in user_bytes for this user and bite
        const userByteQuery = `
            SELECT user_course_id FROM user_bytes WHERE user_id = ? AND bite_id = ?
        `;
        const [userByte] = await db.promise().query(userByteQuery, [user_id, bite_id]);

        if (userByte.length === 0) {
            // No existing record: Insert new enrollment with null completion_date
            const insertEnrollmentQuery = `
                INSERT INTO user_bytes (user_id, bite_id, enrol_date, start_date, completion_date, created_at, updated_at)
                VALUES (?, ?, ?, ?, NULL, NOW(), NOW())
            `;
            await db.promise().query(insertEnrollmentQuery, [user_id, bite_id, enrol_date, enrol_date]);
        } else if (completion_date) {
            // Existing record and completion_date provided: Update completion_date
            const updateCompletionQuery = `
                UPDATE user_bytes
                SET completion_date = ?, updated_at = NOW()
                WHERE user_id = ? AND bite_id = ?
            `;
            await db.promise().query(updateCompletionQuery, [completion_date, user_id, bite_id]);

            // Step 3: Insert into user_bytes_stats if the byte is completed
            const insertStatsQuery = `
                INSERT INTO xp_module.user_bytes_stats (user_id, bite_id, category_id, subcategory_id, learning_points)
                VALUES (?, ?, ?, ?, ?)
            `;
            await db.promise().query(insertStatsQuery, [
                user_id,
                bite_id,
                category_id,
                subcategory_id,
                learning_points
            ]);
        }

        res.status(200).json({ message: 'User byte enrollment or completion processed successfully' });
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ error: 'Database error while processing webhook' });
    }
});

export default WebhookByteStatusRouter;

