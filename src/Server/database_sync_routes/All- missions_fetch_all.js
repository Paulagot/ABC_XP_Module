import pool from '../config_db.js'; // Import the database connection

// all-mission_fetch_all.js
/**
 * Fetches all mission Zenler IDs and relevant mission details from the `missions` table.
 * @returns {Promise<Array>} - Array of mission objects (mission_id, zenler_id, xp, subcategory_id, chain_id).
 */
export const fetchAllMissionZenlerIds = async () => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT mission_id, zenler_id, xp, subcategory_id, chain_id FROM missions', (err, results) => {
      if (err) {
        console.error('Error fetching mission zenler_ids:', err);
        reject(err);
      } else {
        resolve(results);  // Return mission data array
      }
    });
  });
};


