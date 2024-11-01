import { getAllCourseProgress } from './all_byte_progress.js';
import db from '../config_db.js'; // Use your DB connection module
import { fetchAllZenlerIds } from './all_bytes_fetch_all.js';

/// updateAllCoursesProgress.js


/**
 * Updates course progress in the database for all users and all courses listed in the `bites` table.
 * Fetches progress data for each course and updates the `user_bytes` and `user_bytes_stats` tables.
 *
 * @returns {Promise<Object>} - Summary of successful and failed updates, with detailed logs.
 */
export const updateAllCoursesProgress = async () => {
  let successCount = 0;
  let errorCount = 0;
  const errorLog = [];
  const courseUpdateLog = [];

  console.info(`Starting progress update for all users and all courses.`);

  try {
    // Retrieve all course IDs from the bites table
    const zenlerIds = await fetchAllZenlerIds();
    console.info(`Fetched ${zenlerIds.length} zenler_ids from bites table`);

    // Process each course ID
    for (const courseId of zenlerIds) {
      const courseData = await getAllCourseProgress(courseId);

      if (!courseData) {
        errorLog.push(`No data for zenler_id: ${courseId}`);
        errorCount++;
        continue;
      }

      // Process each user's progress in the course data
      for (const uid in courseData) {
        const { email, enrollment_date, start_date, completed_date, completion_percentage } = courseData[uid];

        // Retrieve user_id based on email
        db.query('SELECT user_id FROM users WHERE email = ?', [email], (err, userResults) => {
          if (err || userResults.length === 0) {
            errorLog.push(`User not found for email: ${email}`);
            errorCount++;
            return;
          }

          const userId = userResults[0].user_id;

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

            // Update `user_bytes` table with user progress
            db.query(`
              INSERT INTO user_bytes (user_id, bite_id, enrol_date, start_date, completion_date, course_progress, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
              ON DUPLICATE KEY UPDATE
                start_date = VALUES(start_date),
                completion_date = VALUES(completion_date),
                course_progress = VALUES(course_progress),
                updated_at = NOW()
            `, [userId, bite_id, enrolDate, startDate, completionDate, completion_percentage], (err) => {
              if (err) {
                errorLog.push(`Error updating user_bytes for userId ${userId}: ${err.message}`);
                errorCount++;
              } else {
                successCount++;
                courseUpdateLog.push(`user_bytes updated for userId ${userId}, biteId ${bite_id}`);

                if (completionDate) {
                  // Update `user_bytes_stats` table if the course is completed
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
                    }
                  });
                }
              }
            });
          });
        });
      }
    }
  } catch (error) {
    errorLog.push(`General error: ${error.message}`);
    errorCount++;
  }

  return { successCount, errorCount, errorLog, courseUpdateLog };
};
