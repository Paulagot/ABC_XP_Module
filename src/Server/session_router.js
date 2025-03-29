import express from 'express';


const sessionRouter = express.Router();

// -----------------------------------------------
// Route: GET /session/check-session
// Description: This route checks if the user is authenticated by looking at the session.
//              If a session exists and a user is logged in, it responds with isAuthenticated: true 
//              and sends back user details. If not, it returns isAuthenticated: false.
// -----------------------------------------------
sessionRouter.get('/check-session', (req, res) => {
    // console.log('Session in check-session route:', req.session);  // Log the session data
    
    // Check if there is a session object and a user logged in within that session.
    if (req.session?.user) {
        // If session and user data exist, the user is authenticated
        // Send back the authenticated status and the user data stored in the session
        res.json({ isAuthenticated: true, user: req.session.user, zenlerToken: req.session.zenlerToken || null });
    } else {
        // If no session or user data is found, the user is not authenticated
        res.json({ isAuthenticated: false });
    }
});

/// -----------------------------------------------
// Route: POST /session/logout
// Description: Logs the user out by clearing the session and Zenler SSO token.
//              Also attempts to log out from Zenler by calling the external logout endpoint.
// -----------------------------------------------
sessionRouter.post('/logout', async (req, res) => {
    try {
        if (req.session) {
            // Step 1: Attempt to log out of Zenler by calling their logout endpoint
            await fetch('https://www.ablockofcrypto.com/logout', {
                method: 'POST', // or 'GET' if Zenler requires a different method
                credentials: 'include', // Include credentials if Zenler requires it
            });

            

            // Step 2: Clear Zenler token from session data
            // req.session.zenlerToken = null;

            // Step 3: Destroy the session, removing all session data including user data and Zenler token
            req.session.destroy((err) => {
                if (err) {
                    console.error("Logout failed:", err); // Log the error if session destruction fails
                    res.status(500).send("Logout failed"); // Respond with an error status if logout fails
                } else {
                    // Clear the session cookie on the client-side
                    // res.clearCookie('connect.sid'); // 'connect.sid' is the default cookie name for express-session
                    
                    res.sendStatus(200); // Respond with success status if logout is successful
                }
            });
        } else {
            // If no session exists, respond with 400 status indicating no active session to log out from
            res.status(400).send("No active session");
        }
    } catch (error) {
        console.error("Failed to log out from Zenler:", error);
        res.status(500).send("Logout failed"); // Respond with a 500 status if logout from Zenler fails
    }
});


export default sessionRouter;



