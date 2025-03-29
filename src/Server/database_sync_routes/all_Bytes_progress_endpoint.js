import express from 'express';

import { updateAllCoursesProgress } from './all_Bytes_user_progress.js';

// userprogressrouter.js


const alluserprogressrouter = express.Router();

/**
 * Route to trigger full synchronization of course progress for all users and all courses.
 * Responds with a summary of the update process.
 */
alluserprogressrouter.get('/zenler-progress/full-sync', async (req, res) => {
  try {
    const { successCount, errorCount, errorLog, courseUpdateLog } = await updateAllCoursesProgress();

    res.json({
      message: `Full sync completed: ${successCount} succeeded, ${errorCount} failed.`,
      courseUpdateLog: courseUpdateLog.length ? courseUpdateLog : [],
      errors: errorLog.length ? errorLog : []
    });
  } catch (error) {
    console.error('Error in zenler-progress/full-sync route:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    });
  }
});

export default alluserprogressrouter;