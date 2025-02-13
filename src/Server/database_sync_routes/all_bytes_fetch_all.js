import pool from '../config_db.js'


/**
 * Fetches all zenler_id (course IDs) from the `bites` table.
 * Used to trigger progress data updates for each course.
 *
 * @returns {Promise<Array>} - Returns an array of zenler_id values.
 */
export const fetchAllZenlerIds = async () => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT zenler_id FROM bites', (err, results) => {
      if (err) {
        console.error('Error fetching zenler_ids:', err);
        reject(err);
      } else {
        const zenlerIds = results.map(row => row.zenler_id);
        resolve(zenlerIds);
      }
    });
  });
};