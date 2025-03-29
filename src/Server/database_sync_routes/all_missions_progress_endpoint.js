import express from 'express';
import { updateAllMissionProgress } from './all-mission_user_progress.js'


// missionprogressrouter.js


const allmissionprogressrouter = express.Router();

/**
 * Route to trigger mission progress updates for all users.
 * Returns a summary and log details of the update.
 */
allmissionprogressrouter.get('/mission-progress/update-all', async (req, res) => {
  try {
    const { successCount, errorCount, missionUpdateLog, statsUpdateLog, errors } = await updateAllMissionProgress();

    res.json({
      message: `Mission progress updated: ${successCount} succeeded, ${errorCount} failed.`,
      missionUpdateLog: missionUpdateLog.length ? missionUpdateLog : [],
      statsUpdateLog: statsUpdateLog.length ? statsUpdateLog : [],
      errors: errors || []
    });
  } catch (error) {
    console.error('Error updating mission progress:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    });
  }
});

export default allmissionprogressrouter;
