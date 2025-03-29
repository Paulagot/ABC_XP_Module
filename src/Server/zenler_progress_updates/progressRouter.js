// File: progressRouter.js
import express from 'express';
import { fetchUserIdByEmail } from './fetchUserIdByEmail.js';
import { fetchEnrolledZenlerIds } from './fetchEnrolledBytes.js';
import { getCourseProgress } from './getCourseProgress.js';
import { updateUserProgress } from './updateUserProgress.js';
import { generateDateRange } from './generateDateRange.js';
import { fetchBiteIdByCourseId } from './fetchBiteIdByCourseId.js';
import {fetchMissionIdByCourseId } from './fetchMissionIdByCourseId.js';
import { fetchMissionIds } from './fetchMissionId.js';




const ProgressRouter = express.Router();

/**
 * Route: /update-progress
 * Method: GET
 * Description: Updates user progress for enrolled bytes or missions based on the `type` query parameter.
 * Query Parameter: `type` (optional) - "byte" (default) or "mission".
 */
ProgressRouter.get('/update-progress', async (req, res) => {
   

    // Step 1: Retrieve type and user email
    const type = req.query.type || 'byte'; // Default to "byte"
    const email = req.session?.user?.email;

    
    if (!email) {
        console.error('[ProgressRouter] No email found in session.');
        return res.status(400).json({ error: 'No user email in session' });
    }

    try {
      

        // Step 2: Fetch user ID
        const userId = await fetchUserIdByEmail(email);
        if (!userId) {
            console.error(`[ProgressRouter] User not found for email: ${email}`);
            return res.status(404).json({ error: 'User not found' });
        }
       

        // Step 3: Fetch enrolled IDs based on type
        let enrolledIds;
        if (type === 'byte') {
            enrolledIds = await fetchEnrolledZenlerIds(userId);
        } else if (type === 'mission') {
            enrolledIds = await fetchMissionIds(userId);
        } else {
            console.error(`[ProgressRouter] Invalid type provided: ${type}`);
            return res.status(400).json({ error: 'Invalid type. Must be "byte" or "mission".' });
        }

        if (!enrolledIds || enrolledIds.length === 0) {
           
            return res.status(200).json({ message: `No enrolled ${type}s for user` });
        }
      

        // Step 4: Generate date range
        const { start_date, end_date } = generateDateRange();
       

        // Step 5: Iterate over enrolled IDs and fetch progress for each
        for (const zenlerId of enrolledIds) {
           
            // Fetch progress data from Zenler API
            const progressData = await getCourseProgress(zenlerId, email, start_date, end_date);
            if (!progressData || !progressData.data || !progressData.data.items) {
                console.warn(`[ProgressRouter] No progress data found for ${type} ID: ${zenlerId}`);
                continue;
            }

            // Step 6: Extract course progress details and update database
            for (const uid in progressData.data.items) {
                const courseId = progressData.data.items[uid]?.courseId; // Correctly extract courseId
                if (!courseId) {
                    console.warn(`[ProgressRouter] Missing courseId in progress data for uid: ${uid}`);
                    continue;
                }

              

                // Fetch the corresponding entity ID (mission_id or bite_id)
                const entityId =
                    type === 'mission'
                        ? await fetchMissionIdByCourseId(courseId)
                        : await fetchBiteIdByCourseId(courseId);

                if (!entityId) {
                    console.warn(`[ProgressRouter] No ${type}_id found for courseId: ${courseId}`);
                    continue;
                }

           

                // Update user progress and stats
                await updateUserProgress(userId, entityId, progressData.data.items[uid], type);
            }
        }

        // Step 7: Respond with success
       
        res.status(200).json({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} progress updated successfully` });
    } catch (err) {
        console.error('[ProgressRouter] Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default ProgressRouter;
