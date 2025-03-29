// File: fetchUserIdByEmail.js
import pool from '../config_db.js';

/**
 * Fetch the user_id for a given email.
 * @param {string} email - The email address of the logged-in user.
 * @returns {Promise<number|null>} - Returns the user_id or null if the user is not found.
 */
export const fetchUserIdByEmail = async (email) => {
 

    return new Promise((resolve, reject) => {
        const query = 'SELECT user_id FROM users WHERE email = ?';

      

        pool.query(query, [email], (err, results) => {
            if (err) {
                // Log database errors for debugging purposes.
                console.error('[fetchUserIdByEmail] Database query error:', err);
                return reject(new Error('Error fetching user_id from database.'));
            }

            // Check if the query returned any results.
            if (results.length === 0) {
                console.warn('[fetchUserIdByEmail] No user found for email:', email);
                return resolve(null); // Return null if no user is found.
            }

            // Log the retrieved user_id before resolving.
           
            resolve(results[0].user_id);
        });
    });
};

