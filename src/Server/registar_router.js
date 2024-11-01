import express from 'express';
import bcrypt from 'bcrypt';
import db from './config_db.js';
import axios from 'axios'; // To handle CAPTCHA verification
import crypto from 'crypto';
import { log } from 'console';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';



const Registerrouter = express.Router();
const saltRounds = 10; // Complexity for bcrypt password hashing
const SECRET_KEY = '0x4AAAAAAAyTltxYNhSI2tBoL6GiMKF78Gc'; // Replace with your actual Turnstile secret key from Cloudflare
const ZENLER_API_KEY = 'ONPDVVIYMEGX6WHFL1QCEJ7KN798IXV2';
const ZENLER_ACCOUNT_NAME = 'ABlockofCrypto'; 
const ZENLER_API_URL = 'https://ABlockOfCrypto.newzenler.com/api/v1/users';


// Set up your email transporter using Nodemailer
const transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com', // Use your SMTP server or email provider
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: 'donotreply@ablockofcrypto.com',
        pass: 'donotr3plypa$$word',
    },
});



// ---------------------------------
// SIGN-UP ROUTE WITH CAPTCHA AND ZENLER INTEGRATION
// ---------------------------------
Registerrouter.post('/signup', async (req, res) => {
    // Extract user details from the request body
    const { first_name, last_name, email, password, captchaToken } = req.body;
    console.log("Received CAPTCHA token:", captchaToken);

    // CAPTCHA validation function to verify if the CAPTCHA token is valid
    async function handleCaptchaValidation() {
        try {
            const formData = new URLSearchParams();
            formData.append("secret", SECRET_KEY);
            formData.append("response", captchaToken);
            formData.append("remoteip", req.ip);

            const captchaUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
            const response = await fetch(captchaUrl, {
                body: formData,
                method: "POST",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            const outcome = await response.json();
            console.log("CAPTCHA verification attempt:", outcome);

            if (outcome.success) {
                console.log("CAPTCHA verification succeeded.");
                return true; // CAPTCHA succeeded
            } else {
                console.error("CAPTCHA verification failed:", outcome['error-codes']);
                return false; // CAPTCHA failed
            }
        } catch (error) {
            console.error("Error during CAPTCHA verification:", error);
            return false; // Error during CAPTCHA validation
        }
    }

    // Run CAPTCHA validation
    const isCaptchaValid = await handleCaptchaValidation();
    if (!isCaptchaValid) {
        return res.status(400).json({ error: 'CAPTCHA verification failed. Please try again.' });
    }

    // Check if the user already exists in the local database
    const checkUserSql = 'SELECT * FROM users WHERE email = ?';
    db.query(checkUserSql, [email], (err, result) => {
        if (err) {
            console.error('Database error during user lookup:', err);
            return res.status(500).json({ error: 'Database error during sign-up' });
        }
        if (result.length > 0) {
            console.warn('Attempt to register an existing user:', email);
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password and create a new user record
        bcrypt.hash(password, saltRounds, async (hashErr, hash) => {
            if (hashErr) {
                console.error('Error hashing password:', hashErr);
                return res.status(500).json({ error: 'Error hashing password' });
            }

            // Insert user into local database
            const insertUserSql = 'INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)';
            db.query(insertUserSql, [first_name, last_name, email, hash, 'student'], async (dbErr, dbResult) => {
                if (dbErr) {
                    console.error('Error inserting user into database:', dbErr);
                    return res.status(500).json({ error: 'Error inserting user into database' });
                }
                console.log("User successfully registered in local database:", email);

                try {
                    // Construct the Zenler API URL with query parameters
                    const zenlerUrl = new URL(ZENLER_API_URL);
                    zenlerUrl.searchParams.append('first_name', first_name);
                    zenlerUrl.searchParams.append('last_name', last_name);
                    zenlerUrl.searchParams.append('email', email);
                    zenlerUrl.searchParams.append('password', password);
                    zenlerUrl.searchParams.append('commission', '10'); // default value
                    zenlerUrl.searchParams.append('roles[]', '4'); // default role for student
                    zenlerUrl.searchParams.append('gdpr_consent_status', '1'); // GDPR accepted by default

                    // Log the Zenler API URL for debugging purposes
                    console.log("Zenler API request URL:", zenlerUrl.toString());

                    // Make the request to Zenler, including both API key and account name headers
                    const zenlerResponse = await fetch(zenlerUrl, {
                        method: 'POST',
                        headers: {
                            'X-API-Key': ZENLER_API_KEY,           // API key as per Zenler's requirement
                            'X-Account-Name': ZENLER_ACCOUNT_NAME  // Account name exactly as needed
                        }
                    });

                    // Parse and log the response from Zenler
                    const zenlerData = await zenlerResponse.json();
                    console.log("Zenler registration response:", zenlerData);

                    // Check if the Zenler API response was successful
                    if (zenlerResponse.ok && zenlerData.response_code === 201) {
                        console.log("User registered successfully on Zenler:", zenlerData.data);

                        // Extract the Zenler user ID
                        const zenlerId = zenlerData.data.id;

                        // Update the local database with the Zenler user ID
                        const updateUserSql = 'UPDATE users SET zenler_id = ? WHERE email = ?';
                        db.query(updateUserSql, [zenlerId, email], (updateErr, updateResult) => {
                            if (updateErr) {
                                console.error('Error updating zenler_id in local database:', updateErr);
                                return res.status(500).json({ error: 'Error updating zenler_id in local database' });
                            }

                            console.log(`Zenler ID ${zenlerId} successfully updated for user ${email} in local database.`);
                            return res.status(201).json({ message: 'User registered successfully!' });
                        });
                    } else {
                        console.error("Zenler registration failed:", zenlerData.message);
                        return res.status(500).json({ error: 'Error registering user on Zenler' });
                    }
                } catch (zenlerError) {
                    console.error('Error during Zenler registration:', zenlerError);
                    return res.status(500).json({ error: 'Error communicating with Zenler' });
                }
            });
        });
    });
});


/// ---------------------------------
// SIGN-IN ROUTE (UPDATED FOR SSO)
// ---------------------------------
// POST /login: Login route that authenticates a user, creates an SSO token, and stores session data
Registerrouter.post('/login', (req, res) => {
    const { email, password } = req.body;

    // SQL query to retrieve user data by email from the database
    const getUserSql = 'SELECT * FROM users WHERE email = ?';
    db.query(getUserSql, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error during login' });
        }
        if (result.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        const user = result[0];

        // Compare entered password with hashed password in the database
        bcrypt.compare(password, user.password, (bcryptErr, match) => {
            if (bcryptErr || !match) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Set session data for the authenticated user
            req.session.user = {
                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
            };

            // Generate JWT for Zenler SSO
            const token = jwt.sign(
                {
                    first_name: user.first_name,
                    email: user.email
                },
                'ONPDVVIYMEGX6WHFL1QCEJ7KN798IXV2', // Replace with Zenler's API key or secret
                { algorithm: 'HS256', expiresIn: '1h' }
            );

            // Store the Zenler token in session
            req.session.zenlerToken = token;

            req.session.save((saveErr) => {
                if (saveErr) {
                    return res.status(500).json({ error: 'Failed to save session' });
                }

                // Send session user data and Zenler token to the frontend
                res.status(200).json({
                    message: 'Logged in successfully!',
                    user: req.session.user,
                    zenlerToken: req.session.zenlerToken
                });
            });
        });
    });
});



// ---------------------------------
// PASSWORD RESET ROUTE - Generate Reset Token and Send Email
// ---------------------------------
Registerrouter.post('/password-reset', async (req, res) => {
    const { email, captchaToken } = req.body;

    console.log("Received CAPTCHA token:", captchaToken); 

    async function handleCap() {
        try {
            const formData = new URLSearchParams();
            formData.append("secret", SECRET_KEY);
            formData.append("response", captchaToken);
            formData.append("remoteip", req.ip);
            const idempotencyKey = crypto.randomUUID();
            formData.append("idempotency_key", idempotencyKey);

            const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

            // First verification attempt
            const firstResponse = await fetch(url, {
                body: formData,
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            const firstOutcome = await firstResponse.json();
            console.log("First CAPTCHA verification attempt:", firstOutcome);
            if (firstOutcome.success) {
                console.log("CAPTCHA verification succeeded on first attempt.");
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
            console.log("Second CAPTCHA verification attempt:", subsequentOutcome);
            if (subsequentOutcome.success) {
                console.log("CAPTCHA verification succeeded on second attempt.");
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
    db.query(checkUserSql, [email], (err, result) => {
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
        db.query(updateSql, [resetToken, resetTokenExpiration, result[0].user_id], (dbErr) => {
            if (dbErr) {
                console.error('Database error while updating reset token:', dbErr);
                return res.status(500).json({ error: 'Database error while generating reset token' });
            }

            // Log reset link for testing (replace with actual email sending in production)
            const resetUrl = `http://localhost:5173/register?view=setPassword&token=${resetToken}`;
            console.log(`Password reset link (for testing): ${resetUrl}`);

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
                console.log('Password reset email sent:', info.response);
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
    db.query(sql, [token, Date.now()], (err, result) => {
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
            db.query(updateSql, [hash, user.user_id], (dbErr) => {
                if (dbErr) {
                    console.error('Database error while updating password:', dbErr);
                    return res.status(500).json({ error: 'Database error while updating password.' });
                }

                res.status(200).json({ message: 'Password successfully reset! You can now log in with your new password.' });
            });
        });
    });
});



export default Registerrouter;
