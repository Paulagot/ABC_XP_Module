import { getCourseProgress } from './byte_progress.js';
import db from '../config_db.js'; // Use your DB connection module
import { fetchAllZenlerIds } from './bytes_fetch_all.js';

/**
 * Function to update the user progress for multiple courses (zenler_ids) in the database.
 * This function fetches all zenler_ids from the `bites` table, then calls the Zenler API for each course,
 * processes the data, and updates the database accordingly.
 *
 * @returns {Promise<Object>} - Returns a summary of success and error counts, and an error log if applicable.
 */
export const updateAllCoursesProgress = async () => {
  let successCount = 0;  // Counter for successful updates
  let errorCount = 0;    // Counter for failed updates
  const errorLog = [];   // Log for any errors encountered

  try {
    console.info('Starting course progress update for all courses...');
    console.time('TotalUpdateTime');

    // Fetch all course IDs (zenler_ids) from the `bites` table
    const zenlerIds = await fetchAllZenlerIds();
    console.info(`Fetched ${zenlerIds.length} zenler_ids from the bites table`);

    // Map over each courseId and fetch/update progress in parallel
    const courseProgressPromises = zenlerIds.map(async (courseId) => {
      console.group(`Processing course progress for zenler_id: ${courseId}`);
      console.time(`API Call Time for Course ${courseId}`);

      try {
        // Fetch all paginated user progress data for the course
        const courseData = await getCourseProgress(courseId);
        console.timeEnd(`API Call Time for Course ${courseId}`);

        if (!courseData) {
          console.warn(`No course data returned for zenler_id: ${courseId}`);
          errorLog.push(`No course data for zenler_id: ${courseId}`);
          errorCount++;
          console.groupEnd();
          return;
        }

        for (const uid in courseData) {
          const userProgress = courseData[uid]; // Access user progress data for each user

          // Match Zenler uid to user_id in the database
          db.query('SELECT user_id FROM users WHERE zenler_id = ?', [uid], (err, userResults) => {
            if (err) {
              console.error(`Error fetching user with uid ${uid}:`, err);
              errorLog.push(`Error fetching user with uid ${uid}: ${err.message}`);
              errorCount++;
              return;
            }

            if (userResults.length === 0) {
              console.warn(`User not found for uid: ${uid}`);
              errorLog.push(`User not found for uid: ${uid}`);
              errorCount++;
              return;
            }

            const userId = userResults[0].user_id;

            // Fetch details from the `bites` table for the current course
            db.query('SELECT bite_id, category_id, subcategory_id, points FROM bites WHERE zenler_id = ?', [courseId], (err, biteResults) => {
              if (err) {
                console.error(`Error fetching bite for courseId ${courseId}:`, err);
                errorLog.push(`Error fetching bite for courseId ${courseId}: ${err.message}`);
                errorCount++;
                return;
              }

              if (biteResults.length === 0) {
                console.warn(`Bite not found for zenler_id: ${courseId}`);
                errorLog.push(`Bite not found for zenler_id: ${courseId}`);
                errorCount++;
                return;
              }

              const { bite_id, category_id, subcategory_id, points: learning_points } = biteResults[0];

              const enrolDate = new Date(userProgress.enrollment_date);
              const startDate = userProgress.start_date !== '-' ? new Date(userProgress.start_date) : enrolDate;
              const completionDate = userProgress.completed_date !== '-' ? new Date(userProgress.completed_date) : null;

              // Insert or update user progress in `user_bytes`
              db.query(`
                INSERT INTO user_bytes (user_id, bite_id, enrol_date, start_date, completion_date, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, NOW(), NOW())
                ON DUPLICATE KEY UPDATE
                  start_date = VALUES(start_date),
                  completion_date = VALUES(completion_date),
                  updated_at = NOW()
              `, [userId, bite_id, enrolDate, startDate, completionDate], (err) => {
                if (err) {
                  console.error(`Error updating user_bytes for userId ${userId}:`, err);
                  errorLog.push(`Error updating user_bytes for userId ${userId}: ${err.message}`);
                  errorCount++;
                  return;
                }

                console.info(`User bytes updated for userId: ${userId}, biteId: ${bite_id}`);

                // Insert or update completion data in `user_bytes_stats` if the user completed the byte
                if (completionDate) {
                  db.query(`
                    INSERT INTO user_bytes_stats (user_id, bite_id, category_id, subcategory_id, learning_points, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, NOW(), NOW())
                    ON DUPLICATE KEY UPDATE
                      learning_points = VALUES(learning_points),
                      updated_at = NOW()
                  `, [userId, bite_id, category_id, subcategory_id, learning_points], (err) => {
                    if (err) {
                      console.error(`Error updating user_bytes_stats for userId ${userId}:`, err);
                      errorLog.push(`Error updating user_bytes_stats for userId ${userId}: ${err.message}`);
                      errorCount++;
                      return;
                    }

                    console.info(`User bytes stats updated successfully for userId: ${userId}, biteId: ${bite_id}`);
                    successCount++;
                  });
                }
              });
            });
          });
        }
      } catch (err) {
        console.error(`Error processing zenler_id ${courseId}:`, err);
        errorLog.push(`Error processing zenler_id ${courseId}: ${err.message}`);
        errorCount++;
      }

      console.groupEnd();
    });

    // Wait for all course progress updates to complete
    await Promise.all(courseProgressPromises);
    console.timeEnd('TotalUpdateTime');
    console.info('All course progress updates completed.');

  } catch (error) {
    console.error('General error updating progress for all courses:', error);
    errorLog.push(`General error: ${error.message}`);
    errorCount++;
  }

  return { successCount, errorCount, errorLog }; // Return a summary of success/error counts and error logs
};
