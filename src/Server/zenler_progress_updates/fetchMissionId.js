import pool from '../config_db.js';

/**
 * Fetch the Zenler IDs (zenler_id) for the logged-in user's enrolled missions.
 * @param {number} userId - The user_id of the logged-in user.
 * @returns {Promise<string[]>} - Returns an array of zenler_id.
 */
export const fetchMissionIds = async (userId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT m.zenler_id
            FROM user_missions AS um
            JOIN missions AS m ON um.mission_id = m.mission_id
            WHERE um.user_id = ? AND um.start_date IS NOT NULL
        `;

        pool.query(query, [userId], (err, results) => {
            if (err) {
                console.error('[fetchMissionIds] Database query error:', err);
                return reject(new Error('Error fetching enrolled missions from database.'));
            }

            const zenlerIds = results.map((row) => row.zenler_id);
           
            resolve(zenlerIds);
        });
    });
};
