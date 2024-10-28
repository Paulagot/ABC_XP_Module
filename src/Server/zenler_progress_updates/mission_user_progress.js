
import { fetchAllMissionZenlerIds } from './/missions_fetch_all.js';
import { getMissionProgress } from './mission_progress.js';
import db from './../config_db.js'; // Import the database connection


/**
 * Function to update all mission progress in the database.
 * This function fetches all mission zenler_ids from the `missions` table, retrieves progress data from the Zenler API for each mission,
 * and updates both `user_missions` and `user_missions_stats` tables in the database.
 *
 * @returns {Promise<Object>} - Returns a summary of success and error counts, and detailed logs for each mission update.
 */
export const updateAllMissionProgress = async () => {
  let missionSuccessCount = 0;  // Counter for successful user_missions updates
  let missionErrorCount = 0;    // Counter for failed user_missions updates
  let statsSuccessCount = 0;    // Counter for successful user_missions_stats updates
  let statsErrorCount = 0;      // Counter for failed user_missions_stats updates
  const errorLog = [];          // Log for any errors encountered
  const missionUpdateLog = [];  // Detailed log for each mission update
  const statsUpdateLog = [];    // Detailed log for each stats update

  try {
    console.info('Starting mission progress update for all missions...');

    // Fetch all mission IDs and associated metadata from the `missions` table
    const missionData = await fetchAllMissionZenlerIds();

    // Map over each mission and process updates in parallel
    const missionProgressPromises = missionData.map(async (mission) => {
      const { mission_id, zenler_id, xp, subcategory_id, chain_id } = mission;

      console.group(`Processing mission progress for zenler_id: ${zenler_id}`);
      try {
        // Fetch all paginated user progress data for the mission
        const missionProgress = await getMissionProgress(zenler_id);

        if (!missionProgress) {
          // Log and skip if no data is returned for this mission
          console.warn(`No data returned for zenler_id: ${zenler_id}`);
          errorLog.push(`No data for zenler_id ${zenler_id}`);
          missionErrorCount++;
          console.groupEnd();
          return;
        }

        // Iterate over the mission progress data for each user (uid)
        for (const uid in missionProgress) {
          const userProgress = missionProgress[uid];
          const { enrollment_date, start_date, completed_date } = userProgress;

          // Fetch user_id from `users` table based on Zenler uid
          db.query('SELECT user_id FROM users WHERE zenler_id = ?', [uid], (err, userResults) => {
            if (err || userResults.length === 0) {
              errorLog.push(`Error fetching user with uid ${uid}`);
              missionErrorCount++;
              return;
            }

            const userId = userResults[0].user_id;

            // Update `user_missions` table with user mission progress
            db.query(`
              INSERT INTO user_missions (user_id, mission_id, start_date, completion_date, created_at, updated_at)
              VALUES (?, ?, ?, ?, NOW(), NOW())
              ON DUPLICATE KEY UPDATE
                start_date = VALUES(start_date),
                completion_date = VALUES(completion_date),
                updated_at = NOW()
            `, [userId, mission_id, start_date !== '-' ? new Date(start_date) : new Date(enrollment_date), completed_date !== '-' ? new Date(completed_date) : null], (err) => {
              if (err) {
                missionUpdateLog.push(`Error updating user_missions for userId ${userId}: ${err.message}`);
                missionErrorCount++;
              } else {
                missionSuccessCount++;
                missionUpdateLog.push(`user_missions updated successfully for userId ${userId}, missionId ${mission_id}`);

                // Update `user_missions_stats` only if the mission is completed
                if (completed_date && completed_date !== '-') {
                  db.query(`
                    INSERT INTO user_missions_stats (user_id, mission_id, subcategory_id, chain_id, experience_points, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, NOW(), NOW())
                    ON DUPLICATE KEY UPDATE
                      experience_points = VALUES(experience_points),
                      updated_at = NOW()
                  `, [userId, mission_id, subcategory_id, chain_id, xp], (err) => {
                    if (err) {
                      statsUpdateLog.push(`Error updating user_missions_stats for userId ${userId}: ${err.message}`);
                      statsErrorCount++;
                    } else {
                      statsSuccessCount++;
                      statsUpdateLog.push(`user_missions_stats updated successfully for userId ${userId}, missionId ${mission_id}`);
                    }
                  });
                }
              }
            });
          });
        }
      } catch (err) {
        console.error(`Error processing zenler_id ${zenler_id}:`, err);
        errorLog.push(`Error processing zenler_id ${zenler_id}: ${err.message}`);
        missionErrorCount++;
      }

      console.groupEnd();
    });

    // Wait for all mission progress updates to resolve
    await Promise.all(missionProgressPromises);
    console.info('All mission progress updates completed.');

  } catch (error) {
    console.error('General error updating mission progress:', error);
    errorLog.push(`General error: ${error.message}`);
    missionErrorCount++;
  }

  // Return a detailed summary of the update process
  return {
    successCount: missionSuccessCount + statsSuccessCount, // Total successful updates
    errorCount: missionErrorCount + statsErrorCount,       // Total failed updates
    missionUpdateLog,  // Detailed log for `user_missions` updates
    statsUpdateLog,    // Detailed log for `user_missions_stats` updates
    errors: errorLog.length ? errorLog : null // Any general errors encountered
  };
};
