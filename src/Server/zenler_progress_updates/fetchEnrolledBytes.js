// File: fetchEnrolledBytes.js
import pool from '../config_db.js';

/**
 * Fetch zenler_ids for the logged-in user's enrolled bytes.
 * @param {number} userId - The user_id of the logged-in user.
 * @returns {Promise<string[]>} - Returns an array of zenler_id.
 */
export const fetchEnrolledZenlerIds = async (userId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT b.zenler_id
            FROM user_bytes AS ub
            JOIN bites AS b ON ub.bite_id = b.bite_id
            WHERE ub.user_id = ?
        `;
        pool.query(query, [userId], (err, results) => {
            if (err) {
                console.error('[fetchEnrolledZenlerIds] Database query error:', err);
                return reject(new Error('Error fetching enrolled bytes from database.'));
            }
            resolve(results.map(row => row.zenler_id));
        });
    });
};
