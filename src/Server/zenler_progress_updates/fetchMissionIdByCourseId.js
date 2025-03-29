import pool from '../config_db.js';

/**
 * Fetch the mission_id for a given courseId.
 * @param {string} courseId - The Zenler courseId.
 * @returns {Promise<string|null>} - Returns the mission_id or null if not found.
 */
export const fetchMissionIdByCourseId = async (courseId) => {
   
    return new Promise((resolve, reject) => {
        const query = 'SELECT mission_id FROM missions WHERE zenler_id = ?'; // Change table and column names
        pool.query(query, [courseId], (err, results) => {
            if (err) {
                console.error('[fetchMissionIdByCourseId] Database query error:', err);
                return reject(new Error('Error fetching mission_id from database.'));
            }
            if (results.length === 0) {
                console.warn(`[fetchMissionIdByCourseId] No mission_id found for courseId: ${courseId}`);
                return resolve(null);
            }
            resolve(results[0].mission_id);
        });
    });
};
