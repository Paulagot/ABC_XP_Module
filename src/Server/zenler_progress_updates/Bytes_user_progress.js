import { getCourseProgress } from './byte_progress.js';
import db from '../config_db.js'; // Use your DB connection module
import { fetchAllZenlerIds } from './bytes_fetch_all.js';

/// updateAllCoursesProgress.js


/**
 * Updates course progress in the database for all courses available in the `bites` table.
 * This function calls the Zenler API to fetch user-specific progress data for each course and
 * updates the `user_bytes` and `user_bytes_stats` tables based on this data.
 *
 * @param {string} userEmail - The email of the logged-in user to filter progress data.
 * @returns {Promise<Object>} - Returns an object summarizing the count of successful and failed updates, 
 *                              and detailed logs for each step.
 */
export const updateAllCoursesProgress = async (userEmail) => {
  let successCount = 0;
  let errorCount = 0;
  const errorLog = [];
  const courseUpdateLog = [];

  console.info(`Starting progress update for user: ${userEmail}`);

  try {
    const zenlerIds = await fetchAllZenlerIds();
    console.info(`Fetched ${zenlerIds.length} zenler_ids from bites table`);

    const courseProgressPromises = zenlerIds.map(async (courseId) => {
      try {
        console.info(`Requesting progress data from Zenler for courseId: ${courseId} and email: ${userEmail}`);
        
        // Fetch progress data from Zenler
        const courseData = await getCourseProgress(courseId, userEmail);
        console.log('Zenler API Response Data:', JSON.stringify(courseData, null, 2)); // Detailed API response log

        if (!courseData) {
          errorLog.push(`No data for zenler_id: ${courseId}`);
          errorCount++;
          return;
        }

        // Check if user exists in the database
        db.query('SELECT user_id FROM users WHERE email = ?', [userEmail], (err, userResults) => {
          if (err || userResults.length === 0) {
            errorLog.push(`User not found for email: ${userEmail}`);
            errorCount++;
            return;
          }

          const userId = userResults[0].user_id;
          console.log(`User ID found in DB for email ${userEmail}: ${userId}`); // Log user ID

          // Process each progress record from Zenler
          for (const uid in courseData) {
            const userProgress = courseData[uid];
            const { enrollment_date, start_date, completed_date } = userProgress;

            db.query('SELECT bite_id, category_id, subcategory_id, points FROM bites WHERE zenler_id = ?', [courseId], (err, biteResults) => {
              if (err || biteResults.length === 0) {
                errorLog.push(`Bite not found for zenler_id: ${courseId}`);
                errorCount++;
                return;
              }

              const { bite_id, category_id, subcategory_id, points: learning_points } = biteResults[0];
              const enrolDate = new Date(enrollment_date);
              const startDate = start_date !== '-' ? new Date(start_date) : enrolDate;
              const completionDate = completed_date !== '-' ? new Date(completed_date) : null;

              console.log(`Updating user_bytes for userId ${userId}, biteId ${bite_id}, enrollment date ${enrolDate}, start date ${startDate}, completion date ${completionDate}`);
              
              // Update `user_bytes` table
              db.query(`
                INSERT INTO user_bytes (user_id, bite_id, enrol_date, start_date, completion_date, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, NOW(), NOW())
                ON DUPLICATE KEY UPDATE
                  start_date = VALUES(start_date),
                  completion_date = VALUES(completion_date),
                  updated_at = NOW()
              `, [userId, bite_id, enrolDate, startDate, completionDate], (err) => {
                if (err) {
                  errorLog.push(`Error updating user_bytes for userId ${userId}: ${err.message}`);
                  errorCount++;
                } else {
                  successCount++;
                  courseUpdateLog.push(`user_bytes updated for userId ${userId}, biteId ${bite_id}`);
                  console.log(`Successfully updated user_bytes for userId ${userId}, biteId ${bite_id}`);

                  if (completionDate) {
                    console.log(`Updating user_bytes_stats for userId ${userId}, biteId ${bite_id}, category_id ${category_id}, subcategory_id ${subcategory_id}, learning_points ${learning_points}`);
                    
                    // Update `user_bytes_stats` table
                    db.query(`
                      INSERT INTO user_bytes_stats (user_id, bite_id, category_id, subcategory_id, learning_points, created_at, updated_at)
                      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
                      ON DUPLICATE KEY UPDATE
                        learning_points = VALUES(learning_points),
                        updated_at = NOW()
                    `, [userId, bite_id, category_id, subcategory_id, learning_points], (err) => {
                      if (err) {
                        errorLog.push(`Error updating user_bytes_stats for userId ${userId}: ${err.message}`);
                        errorCount++;
                      } else {
                        successCount++;
                        courseUpdateLog.push(`user_bytes_stats updated for userId ${userId}, biteId ${bite_id}`);
                        console.log(`Successfully updated user_bytes_stats for userId ${userId}, biteId ${bite_id}`);
                      }
                    });
                  }
                }
              });
            });
          }
        });
      } catch (err) {
        errorLog.push(`Error processing zenler_id ${courseId}: ${err.message}`);
        errorCount++;
      }
    });

    await Promise.all(courseProgressPromises);
    console.info(`Progress updates completed for user: ${userEmail}`);
  } catch (error) {
    errorLog.push(`General error: ${error.message}`);
    errorCount++;
  }

  return { successCount, errorCount, errorLog, courseUpdateLog };
};
