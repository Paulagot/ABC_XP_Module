
import { fetchAllMissionZenlerIds } from './All- missions_fetch_all.js';
import { getAllMissionProgress } from './All_mission_progress.js';
import db from '../config_db.js'; // Import the database connection

/**
 * Updates progress for all missions for a single logged-in user, using their session email to filter the data.
 * This function retrieves mission zenler_ids, fetches progress data for each mission, 
 * and updates `user_missions` and `user_missions_stats` tables.
 *
 * @param {string} userEmail - The email of the logged-in user.
 * @returns {Promise<Object>} - Returns a summary of successful and failed updates, and detailed logs for troubleshooting.
 */

/**
 * Updates mission progress for all users in `user_missions` and `user_missions_stats`.
 * Retrieves mission details, fetches user progress, and updates progress and stats.
 */
export const updateAllMissionProgress = async () => {
  let missionSuccessCount = 0;
  let missionErrorCount = 0;
  let statsSuccessCount = 0;
  let statsErrorCount = 0;
  const errorLog = [];
  const missionUpdateLog = [];
  const statsUpdateLog = [];

  try {
    console.info('Starting mission progress update for all users.');

    const missionData = await fetchAllMissionZenlerIds();

    for (const mission of missionData) {
      const { mission_id, zenler_id, xp, subcategory_id, chain_id } = mission;
      const missionProgress = await getAllMissionProgress(zenler_id);

      if (!missionProgress) {
        errorLog.push(`No data for zenler_id ${zenler_id}`);
        missionErrorCount++;
        continue;
      }

      for (const uid in missionProgress) {
        const userProgress = missionProgress[uid];
        const { email, enrollment_date, start_date, completed_date, completion_percentage } = userProgress;

        // Retrieve user_id using email
        db.query('SELECT user_id FROM users WHERE email = ?', [email], (err, userResults) => {
          if (err || userResults.length === 0) {
            errorLog.push(`User not found for email: ${email}`);
            missionErrorCount++;
            return;
          }

          const userId = userResults[0].user_id;

          // Update `user_missions` table with user progress
          db.query(`
            INSERT INTO user_missions (user_id, mission_id, start_date, completion_date, course_progress, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, NOW(), NOW())
            ON DUPLICATE KEY UPDATE
              start_date = VALUES(start_date),
              completion_date = VALUES(completion_date),
              course_progress = VALUES(course_progress),
              updated_at = NOW()
          `, [
            userId,
            mission_id,
            start_date !== '-' ? new Date(start_date) : new Date(enrollment_date),
            completed_date !== '-' ? new Date(completed_date) : null,
            completion_percentage
          ], (err) => {
            if (err) {
              missionUpdateLog.push(`Error updating user_missions for userId ${userId}: ${err.message}`);
              missionErrorCount++;
            } else {
              missionSuccessCount++;
              missionUpdateLog.push(`user_missions updated for userId ${userId}, missionId ${mission_id}`);

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
                    statsUpdateLog.push(`user_missions_stats updated for userId ${userId}, missionId ${mission_id}`);
                  }
                });
              }
            }
          });
        });
      }
    }
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
