import express from 'express';
import bcrypt from 'bcrypt';
import db from './config_db.js'; // Replace with your actual database connection

import crypto from 'crypto';


const Registarrouter = express.Router();
const saltRounds = 10; // Complexity for bcrypt password hashing

// ---------------------------------
// SIGN-UP ROUTE
// ---------------------------------
// This route allows new users to sign up. It hashes the password and stores the user's details in the database.
// Sign-Up Route
Registarrouter.post('/signup', (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    // Check if the user already exists
    const checkUserSql = 'SELECT * FROM users WHERE email = ?';
    db.query(checkUserSql, [email], (err, result) => {
        if (err) {
            console.error('Database error during user lookup:', err);
            return res.status(500).json({ error: 'Database error during sign-up' });
        }
        if (result.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password before storing it
        bcrypt.hash(password, saltRounds, (hashErr, hash) => {
            if (hashErr) {
                console.error('Error hashing password:', hashErr);
                return res.status(500).json({ error: 'Error hashing password' });
            }

            // Insert user into the database
            const insertUserSql = 'INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)';
            db.query(insertUserSql, [first_name, last_name, email, hash, 'student'], (dbErr, dbResult) => {
                if (dbErr) {
                    console.error('Error inserting user into database:', dbErr);  // Log the exact database error
                    return res.status(500).json({ error: 'Error inserting user into database' });
                }
                res.status(201).json({ message: 'User registered successfully!' });
            });
        });
    });
});

// ---------------------------------
// SIGN-IN ROUTE
// ---------------------------------
// This route allows users to log in by comparing the entered password with the stored hashed password.
Registarrouter.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Retrieve the user by email from the database
    const getUserSql = 'SELECT * FROM users WHERE email = ?';
    db.query(getUserSql, [email], (err, result) => {
        if (err) {
            // If there's a database error, return a 500 error
            return res.status(500).json({ error: 'Database error occurred during login' });
        }
        if (result.length === 0) {
            // If no user is found, return a 401 unauthorized error
            return res.status(401).json({ error: 'User not found' });
        }

        const user = result[0];

        // Compare the entered password with the stored hashed password
        bcrypt.compare(password, user.password, (bcryptErr, match) => {
            if (bcryptErr || !match) {
                // If the passwords do not match, return a 401 error for invalid credentials
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // If the password matches, authentication is successful
            // **CREATE A SESSION**: Store user info in req.session
            req.session.user = {
                user_id: user.user_id,
                first_name: user.first_name,
                email: user.email,
                role: user.role
            };

            // Ensure the session is saved before responding
            req.session.save((saveErr) => {
                if (saveErr) {
                    return res.status(500).json({ error: 'Failed to save session' });
                }

                console.log('Session after login:', req.session);  // Log the session to verify
                res.status(200).json({
                    message: 'Logged in successfully!',
                    user: req.session.user  // Return the session data
                });
            });
        });
    });
});


// ---------------------------------
// PASSWORD RESET ROUTE - Generate Reset Token
// ---------------------------------
// This route generates a reset token when a user requests to reset their password.
// The reset token is stored in the database and typically sent via email to the user.
Registarrouter.post('/password-reset', (req, res) => {
    const { email } = req.body;

    // Find the user by their email
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, result) => {
        if (err || result.length === 0) {
            // If the user is not found or a database error occurs, return a 400 error
            return res.status(400).json({ error: 'User not found' });
        }

        const user = result[0];
        const resetToken = crypto.randomBytes(32).toString('hex'); // Generate a random reset token
        const resetTokenExpiration = Date.now() + 3600000; // Token valid for 1 hour (3600000 ms)

        // Store the reset token and its expiration time in the database
        const updateSql = 'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE user_id = ?';
        db.query(updateSql, [resetToken, resetTokenExpiration, user.user_id], (dbErr) => {
            if (dbErr) {
                // If there's an issue updating the database, return a 500 error
                return res.status(500).json({ error: 'Database error while generating reset token' });
            }

            // In a production app, you would send an email containing the reset link with the token.
            // Example reset link: `https://your-app-url/reset-password/${resetToken}`
            res.status(200).json({ message: 'Password reset token generated. Check your email!' });
        });
    });
});

// ---------------------------------
// PASSWORD RESET ROUTE - Reset Password
// ---------------------------------
// This route allows the user to reset their password using the reset token provided.
// The token is validated, and if it's valid, the user's password is updated.
Registarrouter.post('/password-reset/:token', (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    // Validate the reset token and ensure it hasn't expired
    const sql = 'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > ?';
    db.query(sql, [token, Date.now()], (err, result) => {
        if (err || result.length === 0) {
            // If the token is invalid or expired, return a 400 error
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        const user = result[0];

        // Hash the new password before storing it
        bcrypt.hash(password, saltRounds, (hashErr, hash) => {
            if (hashErr) {
                // If there's an error during the hashing process, return a 500 error
                return res.status(500).json({ error: 'Error hashing new password' });
            }

            // Update the user's password and clear the reset token from the database
            const updateSql = 'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE user_id = ?';
            db.query(updateSql, [hash, user.user_id], (dbErr) => {
                if (dbErr) {
                    // If there's an issue updating the database, return a 500 error
                    return res.status(500).json({ error: 'Database error while updating password' });
                }

                // Success! The user's password has been reset.
                res.status(200).json({ message: 'Password reset successfully!' });
            });
        });
    });
});

export default Registarrouter;
