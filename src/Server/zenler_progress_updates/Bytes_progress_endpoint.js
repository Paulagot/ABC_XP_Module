import express from 'express';

import { updateAllCoursesProgress } from './Bytes_user_progress.js';

// userprogressrouter.js


const userprogressrouter = express.Router();

/**
 * Route to trigger the update of course progress for the logged-in user.
 * - This endpoint calls `updateAllCoursesProgress`, which fetches progress data from the Zenler API
 *   for each course associated with the logged-in user’s email and updates the database accordingly.
 * - Returns a summary of successful and failed updates.
 */
userprogressrouter.get('/zenler-progress/all', async (req, res) => {
  // Retrieve the user’s email from the session, assuming the session stores the email for identification
  console.log('Session data:', req.session);
  const userEmail = req.session?.user?.email;

  // Check if the user is authenticated by verifying the presence of an email in the session
  if (!userEmail) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    // Call the function to update all course progress for the specified user email
    const { successCount, errorCount, errorLog } = await updateAllCoursesProgress(userEmail);

    // Respond with a summary of the update results
    res.json({
      message: `Progress updated: ${successCount} succeeded, ${errorCount} failed.`,
      errors: errorLog.length ? errorLog : null // Only include errors if there are any
    });
  } catch (error) {
    console.error('Error in zenler-progress/all route:', error);

    // Handle server errors by responding with a 500 status and an error message
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    });
  }
});

export default userprogressrouter;
