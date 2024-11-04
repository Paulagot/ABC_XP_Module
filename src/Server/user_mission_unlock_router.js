// MissionUnlockRouter.js
import express from 'express';
import db from './config_db.js';

const MissionUnlockRouter = express.Router();

/**
 * Route: POST /check-mission-unlocks
 * Description: Checks if any new missions are unlocked based on the user’s completed bytes.
 * Request Body: 
 *   - user_id: The ID of the user.
 *   - latest_completed_byte_id: The ID of the byte just completed.
 * Response: 
 *   - An array of newly unlocked mission IDs, if any.
 */
MissionUnlockRouter.post('/check-mission-unlocks', async (req, res) => {
    const { user_id, latest_completed_byte_id } = req.body;

    try {
        // Step 1: Fetch all completed bytes for the user
        const completedBytesQuery = `
            SELECT bite_id, points AS lp_value, subcategory_id
            FROM user_bytes
            JOIN bites ON user_bytes.bite_id = bites.bite_id
            WHERE user_id = ? AND completion_date IS NOT NULL;
        `;
        
        const [completedBytes] = await db.query(completedBytesQuery, [user_id]);

        // Step 2: Fetch all mission criteria
        const criteriaQuery = `
            SELECT mission_id, criteria_type, bite_id, subcategory_id, lp_value, condition_type
            FROM mission_criteria;
        `;
        
        const [criteria] = await db.query(criteriaQuery);

        // Step 3: Check if any missions are unlocked based on completed bytes
        const unlockedMissions = calculateUnlockedMissions(completedBytes, criteria, latest_completed_byte_id);

        res.status(200).json({ unlockedMissions });
    } catch (error) {
        console.error('Error checking mission unlocks:', error);
        res.status(500).json({ error: 'Database error or logic issue' });
    }
});

/**
 * Helper function to determine which missions are unlocked.
 */
function calculateUnlockedMissions(completedBytes, criteria, latest_completed_byte_id) {
    const unlockedMissions = [];

    // Group criteria by mission_id
    const groupedCriteria = criteria.reduce((acc, criterion) => {
        const missionId = criterion.mission_id;
        if (!acc[missionId]) acc[missionId] = [];
        acc[missionId].push(criterion);
        return acc;
    }, {});

    for (const [missionId, missionCriteria] of Object.entries(groupedCriteria)) {
        let allAndCriteriaMet = true;
        let atLeastOneOrCriteriaMet = false;

        for (const criterion of missionCriteria) {
            if (criterion.condition_type === 'And' || criterion.condition_type === 'None') {
                allAndCriteriaMet = allAndCriteriaMet && checkCriterionMet(criterion, completedBytes);
            } else if (criterion.condition_type === 'Or') {
                atLeastOneOrCriteriaMet = atLeastOneOrCriteriaMet || checkCriterionMet(criterion, completedBytes);
            }
        }

        if (allAndCriteriaMet && atLeastOneOrCriteriaMet) {
            unlockedMissions.push(missionId);
        }
    }

    return unlockedMissions;
}

/**
 * Helper function to check if a criterion is met.
 */
function checkCriterionMet(criterion, completedBytes) {
    if (criterion.criteria_type === 'Bite Complete') {
        return completedBytes.some(byte => byte.bite_id === criterion.bite_id);
    } else if (criterion.criteria_type === 'LP Required') {
        const lpInSubcategory = completedBytes
            .filter(byte => byte.subcategory_id === criterion.subcategory_id)
            .reduce((acc, byte) => acc + byte.lp_value, 0);
        return lpInSubcategory >= criterion.lp_value;
    }
    return false;
}

export default MissionUnlockRouter;
