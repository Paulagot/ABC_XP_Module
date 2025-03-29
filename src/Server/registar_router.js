import express from 'express';
import bcrypt from 'bcrypt';
import pool from './config_db.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config()
const appUrl = process.env.APP_URL || 'http://localhost:5173';


const Registerrouter = express.Router();
const saltRounds = 10; // Complexity for bcrypt password hashing

// Extract specific environment variables
const {
   
    TURNSTILE_SECRET_KEY,
    CAPTCHA_VERIFY_URL,
    ZENLER_API_KEY,
    ZENLER_ACCOUNT_NAME,
    ZENLER_USERS_API_URL,
    ZENLER_SSO_BASE_URL,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASSWORD
} = process.env;


// Set up your email transporter using Nodemailer

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number.parseInt(SMTP_PORT, 10),
    secure: SMTP_SECURE === "true",
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
    },
});



// ---------------------------------
// SIGN-UP ROUTE WITH CAPTCHA AND ZENLER INTEGRATION
// ---------------------------------
// Zenler User Processing Function
async function processZenlerUser(email, first_name, last_name, password) {
    try {
        // Search for user in Zenler
        const userSearchUrl = new URL(ZENLER_USERS_API_URL);
        userSearchUrl.searchParams.append('search', email);

        const userResponse = await fetch(userSearchUrl, {
            method: 'GET',
            headers: {
                'X-API-Key': ZENLER_API_KEY,
                'X-Account-Name': ZENLER_ACCOUNT_NAME,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const userData = await userResponse.json();

        // Check for existing user with role 8 (lead)
        if (userData.data.items.length > 0) {
            const existingUser = userData.data.items[0];
            
            // Update to include student role if only lead
            if (existingUser.roles.includes(8) && !existingUser.roles.includes(4)) {
                const userId = existingUser.id;

                const updateUrl = `${ZENLER_USERS_API_URL}/${userId}`;
                const updateResponse = await fetch(updateUrl, {
                    method: 'PUT',
                    headers: {
                        'X-API-Key': ZENLER_API_KEY,
                        'X-Account-Name': ZENLER_ACCOUNT_NAME,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        roles: [8, 4]  // Preserve lead role, add student role
                    })
                });

                const updateResult = await updateResponse.json();
                
                // Return existing Zenler user ID if update successful
                if (updateResult.response_code === 200) {
                    return { 
                        zenlerId: userId, 
                        isNewUser: false 
                    };
                }
            }
            
            // If user already has both roles
            return { 
                zenlerId: existingUser.id, 
                isNewUser: false 
            };
        }

        // Create new user in Zenler if not found
        const zenlerUrl = new URL(ZENLER_USERS_API_URL);
        zenlerUrl.searchParams.append('first_name', first_name);
        zenlerUrl.searchParams.append('last_name', last_name);
        zenlerUrl.searchParams.append('email', email);
        zenlerUrl.searchParams.append('password', password);
        zenlerUrl.searchParams.append('commission', '10');
        zenlerUrl.searchParams.append('roles[]', '4');
        zenlerUrl.searchParams.append('gdpr_consent_status', '1');

        const zenlerResponse = await fetch(zenlerUrl, {
            method: 'POST',
            headers: {
                'X-API-Key': ZENLER_API_KEY,
                'X-Account-Name': ZENLER_ACCOUNT_NAME
            }
        });

        const zenlerData = await zenlerResponse.json();

        // Return new Zenler user ID if creation successful
        if (zenlerResponse.ok && zenlerData.response_code === 201) {
            return { 
                zenlerId: zenlerData.data.id, 
                isNewUser: true 
            };
        }

        throw new Error('Failed to process Zenler user');

    } catch (error) {
        console.error('Error processing Zenler user:', error);
        throw error;
    }
}

// CAPTCHA Validation Function
async function validateCaptcha(captchaToken, ip) {
    try {
        const formData = new URLSearchParams();
        formData.append("secret", TURNSTILE_SECRET_KEY);
        formData.append("response", captchaToken);
        formData.append("remoteip", ip);

        const response = await fetch(CAPTCHA_VERIFY_URL, {
            body: formData,
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        
        const outcome = await response.json();
        return outcome.success;
    } catch (error) {
        console.error("CAPTCHA verification error:", error);
        return false;
    }
}

// SIGNUP ROUTE
Registerrouter.post('/signup', async (req, res) => {
    const { first_name, last_name, email, password, captchaToken } = req.body;

    // Validate CAPTCHA
    const isCaptchaValid = await validateCaptcha(captchaToken, req.ip);
    if (!isCaptchaValid) {
        return res.status(400).json({ error: 'CAPTCHA verification failed' });
    }

    // Check if user exists in local database
    const checkUserSql = 'SELECT * FROM users WHERE email = ?';
    pool.query(checkUserSql, [email], (err, result) => {
        if (err) {
            console.error('Database error during user lookup:', err);
            return res.status(500).json({ error: 'Database error during sign-up' });
        }
        if (result.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        bcrypt.hash(password, saltRounds, async (hashErr, hash) => {
            if (hashErr) {
                console.error('Password hashing error:', hashErr);
                return res.status(500).json({ error: 'Password hashing error' });
            }

            try {
                // Process Zenler user
                const zenlerResult = await processZenlerUser(email, first_name, last_name, password);

                // Insert user into local database
                const insertUserSql = 'INSERT INTO users (first_name, last_name, email, password, role, zenler_id) VALUES (?, ?, ?, ?, ?, ?)';
                pool.query(insertUserSql, [first_name, last_name, email, hash, 'student', zenlerResult.zenlerId], (dbErr) => {
                    if (dbErr) {
                        console.error('Database insertion error:', dbErr);
                        return res.status(500).json({ error: 'User registration failed' });
                    }

                    return res.status(201).json({ 
                        message: zenlerResult.isNewUser 
                            ? 'New user registered successfully!' 
                            : 'Existing user updated successfully!' 
                    });
                });

            } catch (zenlerError) {
                console.error('Zenler processing error:', zenlerError);
                return res.status(500).json({ error: 'User registration failed' });
            }
        });
    });
});

/// ---------------------------------
// SIGN-IN ROUTE (UPDATED FOR SSO)
// ---------------------------------
// POST /login: Login route that authenticates a user, creates an SSO token, and stores session data
Registerrouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

   

    // SQL query to retrieve user data by email from the database
    const getUserSql = 'SELECT * FROM users WHERE email = ?';
    pool.query(getUserSql, [email], async (err, result) => {
        if (err) {
            console.error('Database error during user lookup:', err);
            return res.status(500).json({ error: 'Database error during login' });
        }
        if (result.length === 0) {
            console.warn('User not found for email:', email);
            return res.status(401).json({ error: 'User not found' });
        }

        const user = result[0];
        

        // Compare entered password with hashed password in the database
        bcrypt.compare(password, user.password, async (bcryptErr, match) => {
            if (bcryptErr || !match) {
                console.warn('Invalid password for email:', email);
                return res.status(401).json({ error: 'Invalid credentials' });
            }

           

            // Set session data for the authenticated user
            req.session.user = {
                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
                zenler_id: user.zenler_id
            };

            // Generate JWT for Zenler SSO
            const token = jwt.sign(
                {
                    first_name: user.first_name,
                    email: user.email,
                    iat: Math.floor(Date.now() / 1000), // Issued at
                    exp: Math.floor(Date.now() / 1000) + 3600 // Expiry (1 hour later)
                },
                ZENLER_API_KEY,
                { algorithm: 'HS256' }
            );

          

            // Store the Zenler token in the session
            req.session.zenlerToken = token;

            req.session.save((saveErr) => {
                if (saveErr) {
                    console.error('Error saving session:', saveErr);
                    return res.status(500).json({ error: 'Failed to save session' });
                }

              
                res.status(200).json({
                    message: 'Logged in successfully!',
                    user: req.session.user
                });
            });
        });
    });
});

Registerrouter.post('/sso', (req, res) => {
    
    const user = req.session.user;
   

    if (!user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    // Generate a new JWT for Zenler SSO
    const token = jwt.sign(
        {
            first_name: user.first_name,
            email: user.email,
            iat: Math.floor(Date.now() / 1000) -200, // Issued at (current timestamp in seconds)
            exp: Math.floor(Date.now() / 1000) + 3600 // Expiry (1 hour later)
        },
        ZENLER_API_KEY,
        { algorithm: 'HS256' }
    );

    // Construct the SSO URL
    const { courseUrl } = req.body; // Get the course URL from the request body
    const returnTo = courseUrl;
    const errorUrl = courseUrl; // Redirect to the course URL on error
    const ssoUrl = `${ZENLER_SSO_BASE_URL}?token=${token}&return_to=${encodeURIComponent(returnTo)}&error_url=${encodeURIComponent(errorUrl)}`;

   

    res.status(200).json({ ssoUrl });
});




// ---------------------------------
// PASSWORD RESET ROUTE - Generate Reset Token and Send Email
// ---------------------------------
Registerrouter.post('/password-reset', async (req, res) => {
    const { email, captchaToken } = req.body;

  

    async function handleCap() {
        try {
            const formData = new URLSearchParams();
            formData.append("secret", SECRET_KEY);
            formData.append("response", captchaToken);
            formData.append("remoteip", req.ip);
            const idempotencyKey = crypto.randomUUID();
            formData.append("idempotency_key", idempotencyKey);

            const url = process.env.CAPTCHA_VERIFY_URL;

            // First verification attempt
            const firstResponse = await fetch(url, {
                body: formData,
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            const firstOutcome = await firstResponse.json();
           
            if (firstOutcome.success) {
               
            } else {
                console.error("First CAPTCHA verification failed:", firstOutcome['error-codes']);
                return res.status(400).json({ error: 'CAPTCHA verification failed. Please try again.' });
            }

            // Optional second verification request with idempotency key
            const subsequentResponse = await fetch(url, {
                body: formData,
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            const subsequentOutcome = await subsequentResponse.json();
           
            if (subsequentOutcome.success) {
                
            }

        } catch (error) {
            console.error("Error during CAPTCHA verification:", error);
            return res.status(500).json({ error: "Error verifying CAPTCHA. Please try again later." });
        }
    }

    // Run the CAPTCHA validation function
    await handleCap();

    // Step 2: Check if the user exists
    const checkUserSql = 'SELECT * FROM users WHERE email = ?';
    pool.query(checkUserSql, [email], (err, result) => {
        if (err) {
            console.error('Database error during user lookup:', err);
            return res.status(500).json({ error: 'Database error during password reset request' });
        }
        if (result.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Step 3: Generate reset token and expiration
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiration = Date.now() + 3600000; // 1 hour expiration

        // Step 4: Update the user record with reset token and expiration
        const updateSql = 'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE user_id = ?';
        pool.query(updateSql, [resetToken, resetTokenExpiration, result[0].user_id], (dbErr) => {
            if (dbErr) {
                console.error('Database error while updating reset token:', dbErr);
                return res.status(500).json({ error: 'Database error while generating reset token' });
            }

            // Log reset link for testing (replace with actual email sending in production)
            const resetUrl = `${appUrl}/register?view=setPassword&token=${resetToken}`;
           console.log(resetUrl);

            // Placeholder email sending (log for now)
            const mailOptions = {
                from: 'donotreply@ablockofcrypto.com',
                to: email,
                subject: 'Password Reset Request',
                html: `
                    <p>Hello,</p>
                    <p>You requested a password reset. Click the link below to reset your password:</p>
                    <a href="${resetUrl}">Reset Password</a>
                    <p>If you did not request this, please ignore this email.</p>
                `,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending password reset email:', error);
                    return res.status(500).json({ error: 'Failed to send password reset email.' });
                }
                
                res.status(200).json({ message: 'Password reset token generated and email sent.' });
            });
        });
    });
});



// ---------------------------------
// PASSWORD RESET CONFIRMATION - Update Password
// ---------------------------------
Registerrouter.post('/password-reset/:token', (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    // Step 1: Validate the reset token and check expiration
    const sql = 'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > ?';
    pool.query(sql, [token, Date.now()], (err, result) => {
        if (err) {
            console.error('Database error during token validation:', err);
            return res.status(500).json({ error: 'Database error while validating token.' });
        }
        if (result.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        const user = result[0];

        // Step 2: Hash the new password and update the database
        bcrypt.hash(password, saltRounds, (hashErr, hash) => {
            if (hashErr) {
                console.error('Error hashing new password:', hashErr);
                return res.status(500).json({ error: 'Error hashing new password' });
            }

            // Clear reset token and update with the new password
            const updateSql = 'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE user_id = ?';
            pool.query(updateSql, [hash, user.user_id], (dbErr) => {
                if (dbErr) {
                    console.error('Database error while updating password:', dbErr);
                    return res.status(500).json({ error: 'Database error while updating password.' });
                }

                res.status(200).json({ message: 'Password successfully reset! You can now log in with your new password.' });
            });
        });
    });
});


// ---------------------------------
// ENROLL ROUTE - Enroll user in Zenler course and update local database
// ---------------------------------

const ZENLER_API_URL = 'https://api.newzenler.com/api/v1';

Registerrouter.post('/enroll', async (req, res) => {
    const { userZenlerId, courseZenlerId, reference_type } = req.body;

    if (!userZenlerId || !courseZenlerId || !reference_type) {
        console.error("Missing parameters:", { userZenlerId, courseZenlerId, reference_type });
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        // Confirm session data
        const { user_id } = req.session.user || {};
        if (!user_id) {
            throw new Error("User ID is missing in session data.");
        }

        // Make the API call to Zenler with correct URL structure
        const response = await axios.post(
            `${ZENLER_API_URL}/courses/${courseZenlerId}/enroll`,
            { 
                users: [userZenlerId]
            },
            {
                headers: {
                    'X-API-Key': process.env.ZENLER_API_KEY,
                    'X-Account-Name': process.env.ZENLER_ACCOUNT_NAME,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );

        if (response.status === 200 && response.data.response_code === 200) {
            // Get the actual `bite_id` or `mission_id` from the database
            let dbQuery, idField;

            if (reference_type === 'byte') {
                dbQuery = `SELECT bite_id FROM bites WHERE zenler_id = ?`;
                idField = 'bite_id';
            } else if (reference_type === 'mission') {
                dbQuery = `SELECT mission_id FROM missions WHERE zenler_id = ?`;
                idField = 'mission_id';
            } else {
                console.error("Invalid reference type:", reference_type);
                return res.status(400).json({ error: 'Invalid reference type' });
            }

            const [rows] = await pool.promise().query(dbQuery, [courseZenlerId]);
            if (rows.length === 0) {
                console.error(`${idField} not found for zenler_id:`, courseZenlerId);
                return res.status(400).json({ error: 'Invalid course ID' });
            }

            const actualId = rows[0][idField];

            // Current date-time for database updates
            const enrolDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const createdAt = enrolDate;
            const updatedAt = enrolDate;

            // Insert into the correct table
            let insertQuery;
            if (reference_type === 'byte') {
                insertQuery = `
                    INSERT INTO user_bytes (user_id, bite_id, enrol_date, start_date, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;
            } else if (reference_type === 'mission') {
                insertQuery = `
                    INSERT INTO user_missions (user_id, mission_id, enrol_date, start_date, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;
            }

            await pool.promise().query(insertQuery, [user_id, actualId, enrolDate, enrolDate, createdAt, updatedAt]);

            return res.status(200).json({ 
                message: 'Enrollment and database update successful',
                data: response.data
            });
        } else {
            console.error("Enrollment failed:", response.data);
            return res.status(500).json({ error: 'Failed to enroll user on Zenler' });
        }
    } catch (error) {
        console.error("Error during enrollment:", error.response?.data || error.message);
        return res.status(500).json({ 
            error: 'An error occurred during enrollment',
            details: error.response?.data || error.message
        });
    }
});


export default Registerrouter;
