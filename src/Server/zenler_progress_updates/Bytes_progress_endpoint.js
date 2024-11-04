import express from 'express';

import { updateAllCoursesProgress } from './Bytes_user_progress.js';


const userprogressrouter = express.Router();

/**
 * Route to trigger a full update of course progress for all users.
 * - Calls `updateAllCoursesProgress`, which fetches progress data from the Zenler API
 *   for each course and updates the `user_bytes` table in the database.
 * - Returns a summary of successful and failed updates.
 */
userprogressrouter.get('/zenler-progress/all', async (req, res) => {
  try {
    // Call the function to update progress for all users
    const { successCount, errorCount, errorLog } = await updateAllCoursesProgress();

    // Respond with a summary of the update results
    res.json({
      message: `Progress updated: ${successCount} succeeded, ${errorCount} failed.`,
      errors: errorLog.length ? errorLog : null // Include errors if there are any
    });
  } catch (error) {
    console.error('Error in zenler-progress/all route:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    });
  }
});

export default userprogressrouter;
