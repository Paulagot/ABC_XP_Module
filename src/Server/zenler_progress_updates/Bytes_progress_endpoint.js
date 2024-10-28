import express from 'express';

import { updateAllCoursesProgress } from './Bytes_user_progress.js';

const userprogressrouter = express.Router();

/**
 * Route to trigger the update of course progress.
 * When accessed, it will fetch the progress data from Zenler API and update the database.
 */
userprogressrouter.get('/zenler-progress/all', async (req, res) => {
    try {
      const { successCount, errorCount, errorLog } = await updateAllCoursesProgress();
  
      // Construct response based on the summary
      res.json({
        message: `Course progress updated: ${successCount} succeeded, ${errorCount} failed.`,
        errors: errorLog.length ? errorLog : null // If there are errors, include them in the response
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

