import express from 'express';
import session from 'express-session'

const sessionRouter = express.Router();

// -----------------------------------------------
// Route: GET /session/check-session
// Description: This route checks if the user is authenticated by looking at the session.
//              If a session exists and a user is logged in, it responds with isAuthenticated: true 
//              and sends back user details. If not, it returns isAuthenticated: false.
// -----------------------------------------------
sessionRouter.get('/check-session', (req, res) => {
    console.log('Session in check-session route:', req.session);  // Log the session data
    
    // Check if there is a session object and a user logged in within that session.
    if (req.session && req.session.user) {
        // If session and user data exist, the user is authenticated
        // Send back the authenticated status and the user data stored in the session
        res.json({ isAuthenticated: true, user: req.session.user, zenlerToken: req.session.zenlerToken || null });
    } else {
        // If no session or user data is found, the user is not authenticated
        res.json({ isAuthenticated: false });
    }
});

// -----------------------------------------------
// Route: POST /session/logout
// Description: This route logs the user out by destroying the session.
//              If a session exists, it will be destroyed, and the session cookie will be cleared.
//              If there is no active session, it returns an error response.
// -----------------------------------------------
sessionRouter.post('/logout', (req, res) => {
    // Check if the session exists (i.e., the user is logged in)
    if (req.session) {
        // Destroy the session, which will remove all session data for this user.
        req.session.destroy((err) => {
            if (err) {
                // If there was an error while destroying the session, return a 500 status code
                // This can happen due to internal server issues
                console.error("Logout failed:", err); // Log the error for debugging
                res.status(500).send("Logout failed"); // Send an error message to the client
            } else {
                // If session destruction was successful, clear the session cookie on the client-side
                // 'connect.sid' is the default cookie name used by express-session to store the session ID
                res.clearCookie('connect.sid');
                
                // Send a 200 OK status code to indicate the user was successfully logged out
                res.sendStatus(200);
            }
        });
    } else {
        // If there was no active session, return a 400 Bad Request
        // This means the user was already logged out or never logged in
        res.status(400).send("No active session");
    }
});

export default sessionRouter;

