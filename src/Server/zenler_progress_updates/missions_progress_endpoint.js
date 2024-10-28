import express from 'express';
import { updateAllMissionProgress } from './mission_user_progress.js'


const missionprogressrouter = express.Router();

/**
 * Route to trigger mission progress updates for all missions.
 * - Calls the `updateAllMissionProgress` function and returns a summary with detailed logs.
 */
missionprogressrouter.get('/mission-progress/update', async (req, res) => {
  try {
    // Run the mission update process
    const {
      successCount,
      errorCount,
      missionUpdateLog,
      statsUpdateLog,
      errors
    } = await updateAllMissionProgress();

    // Send a detailed response with the update summary
    res.json({
      message: `Mission progress updated: ${successCount} succeeded, ${errorCount} failed.`,
      missionUpdateLog: missionUpdateLog.length ? missionUpdateLog : [],
      statsUpdateLog: statsUpdateLog.length ? statsUpdateLog : [],
      errors: errors || [] // Empty array if no errors
    });
  } catch (error) {
    console.error('Error updating mission progress:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    });
  }
});

export default missionprogressrouter;
