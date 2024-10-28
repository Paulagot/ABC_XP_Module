import db from './../config_db.js'; // Import the database connection

/**
 * Fetches all mission zenler_ids along with relevant mission details from the `missions` table.
 * 
 * @returns {Promise<Array>} - Returns an array of objects containing mission data:
 *   - `mission_id` - Unique identifier for each mission.
 *   - `zenler_id` - Zenler ID corresponding to each mission.
 *   - `xp` - Experience points for each mission.
 *   - `subcategory_id` - Subcategory ID linked to each mission.
 *   - `chain_id` - Chain ID associated with each mission.
 */
export const fetchAllMissionZenlerIds = async () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT mission_id, zenler_id, xp, subcategory_id, chain_id FROM missions', (err, results) => {
      if (err) {
        console.error('Error fetching zenler_ids from missions:', err);
        reject(err);
      } else {
        resolve(results); // Return the array of mission data
      }
    });
  });
};

