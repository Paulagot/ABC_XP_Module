
import { fetchAllMissionZenlerIds } from './/missions_fetch_all.js';
import { getMissionProgress } from './mission_progress.js';
import db from './../config_db.js'; // Import the database connection

/**
 * Updates progress for all missions for a single logged-in user, using their session email to filter the data.
 * This function retrieves mission zenler_ids, fetches progress data for each mission, 
 * and updates `user_missions` and `user_missions_stats` tables.
 *
 * @param {string} userEmail - The email of the logged-in user.
 * @returns {Promise<Object>} - Returns a summary of successful and failed updates, and detailed logs for troubleshooting.
 */
export const updateAllMissionProgress = async (userEmail) => {
  let missionSuccessCount = 0;  // Successful updates for user_missions
  let missionErrorCount = 0;    // Failed updates for user_missions
  let statsSuccessCount = 0;    // Successful updates for user_missions_stats
  let statsErrorCount = 0;      // Failed updates for user_missions_stats
  const errorLog = [];          // General error log
  const missionUpdateLog = [];  // Log specific to `user_missions` updates
  const statsUpdateLog = [];    // Log specific to `user_missions_stats` updates

  try {
    console.info('Starting mission progress update for all missions...');

    // Fetch all mission zenler_ids and relevant details from `missions`
    const missionData = await fetchAllMissionZenlerIds();

    // Process each mission's progress data
    const missionProgressPromises = missionData.map(async (mission) => {
      const { mission_id, zenler_id, xp, subcategory_id, chain_id } = mission;

      try {
        // Fetch progress data for the specific mission and user
        const missionProgress = await getMissionProgress(zenler_id, userEmail);

        if (!missionProgress) {
          errorLog.push(`No data for zenler_id ${zenler_id}`);
          missionErrorCount++;
          return;
        }

        for (const uid in missionProgress) {
          const userProgress = missionProgress[uid];
          const { enrollment_date, start_date, completed_date } = userProgress;

          // Get user_id based on Zenler uid and email
          db.query('SELECT user_id FROM users WHERE email = ?', [userEmail], (err, userResults) => {
            if (err || userResults.length === 0) {
              errorLog.push(`User not found for email: ${userEmail}`);
              missionErrorCount++;
              return;
            }

            const userId = userResults[0].user_id;

            // Update `user_missions` table with user progress
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

                // Only update `user_missions_stats` if mission completed
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
        errorLog.push(`Error processing zenler_id ${zenler_id}: ${err.message}`);
        missionErrorCount++;
      }
    });

    await Promise.all(missionProgressPromises);
    console.info('All mission progress updates completed.');

  } catch (error) {
    errorLog.push(`General error: ${error.message}`);
    missionErrorCount++;
  }

  return {
    successCount: missionSuccessCount + statsSuccessCount,
    errorCount: missionErrorCount + statsErrorCount,
    missionUpdateLog,
    statsUpdateLog,
    errors: errorLog.length ? errorLog : null
  };
};