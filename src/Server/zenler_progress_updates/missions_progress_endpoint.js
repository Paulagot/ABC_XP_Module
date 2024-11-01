import express from 'express';
import { updateAllMissionProgress } from './mission_user_progress.js'


// missionprogressrouter.js


const missionprogressrouter = express.Router();

/**
 * Route to trigger mission progress updates for all missions for the logged-in user.
 * - Fetches user email from session, then calls `updateAllMissionProgress` for progress update.
 * - Responds with a summary and logs detailing the update status.
 */
missionprogressrouter.get('/mission-progress/update', async (req, res) => {
  const userEmail = req.session?.user?.email; // Get the user's email from session

  if (!userEmail) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const {
      successCount,
      errorCount,
      missionUpdateLog,
      statsUpdateLog,
      errors
    } = await updateAllMissionProgress(userEmail);

    // Send response with detailed summary and logs
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

export default missionprogressrouter;
