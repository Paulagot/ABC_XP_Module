import pool from '../config_db.js';

/**
 * Fetch the bite_id for a given courseId.
 * @param {string} courseId - The Zenler courseId.
 * @returns {Promise<string|null>} - Returns the bite_id or null if not found.
 */
export const fetchBiteIdByCourseId = async (courseId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT bite_id FROM bites WHERE zenler_id = ?';
        pool.query(query, [courseId], (err, results) => {
            if (err) {
                console.error('[fetchBiteIdByCourseId] Database query error:', err);
                return reject(new Error('Error fetching bite_id from database.'));
            }
            if (results.length === 0) {
                console.warn(`[fetchBiteIdByCourseId] No bite_id found for courseId: ${courseId}`);
                return resolve(null);
            }
            resolve(results[0].bite_id);
        });
    });
};
