import db from './../config_db.js'

/**
 * Function to fetch all zenler_id (courseIds) from the bites table.
 *
 * @returns {Promise<Array>} - Returns an array of zenler_id (courseIds).
 */
export const fetchAllZenlerIds = async () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT zenler_id FROM bites', (err, results) => {
      if (err) {
        console.error('Error fetching zenler_ids:', err);
        reject(err);
        return;
      }

      // Extract zenler_id from results
      const zenlerIds = results.map(row => row.zenler_id);
      resolve(zenlerIds);
    });
  });
};
