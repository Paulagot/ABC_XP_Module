// sponsorRoutes.js
// admin end
// this is to allow manage sponsors form in admin.

import express from 'express';
import pool from './config_db.js';

const sponsorRouter = express.Router();

// Create a new sponsor
sponsorRouter.post('/sponsors', (req, res) => {
    const { name, sponsor_image, website } = req.body;

    
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    if (!sponsor_image) {
        return res.status(400).json({ error: 'sponsor_image is required' });
    }
    if (!website) {
        return res.status(400).json({ error: 'website is required' });
    }

     // Check for duplicate name
     const checkDuplicateQuery = 'SELECT COUNT(*) as count FROM sponsors WHERE name = ?';
     pool.query(checkDuplicateQuery, [name], (err, results) => {
         if (err) {
             console.error('Database query error:', err);
             return res.status(500).json({ error: 'Database error', details: err });
         }
         if (results[0].count > 0) {
             return res.status(409).json({ error: 'sponsor name already exists' });
         }

       // Insert new sponsor
       const query = 'INSERT INTO sponsors (name, sponsor_image, website, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())';
       const values = [name, sponsor_image, website];

       pool.query(query, values, (err, result) => {
           if (err) {
               console.error('Database query error:', err);
               return res.status(500).json({ error: 'Database error', details: err });
           }
           return res.status(201).json({ id: result.insertId, name, sponsor_image, website });
       });
   });
});

// Search sponsors by name
sponsorRouter.get('/sponsors/search', (req, res) => {
    const { q } = req.query;
    const query = 'SELECT * FROM sponsors WHERE name LIKE ?';
    const values = [`%${q}%`];

    pool.query(query, values, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }
        return res.status(200).json(results);
    });
});

// Route to update an existing sponsor
sponsorRouter.put('/sponsors/:id', (req, res) => {
    const { id } = req.params;
    const { name, sponsor_image, website } = req.body;

    // Check if name or sponsor_image or website is empty
    if (!name || !sponsor_image || !website) {
        return res.status(400).json({ error: 'Name and sponsor_image and website are required.' });
    }

    const query = 'UPDATE sponsors SET name = ?, sponsor_image = ?,  website = ?, updated_at = NOW() WHERE sponsor_id = ?';
    const values = [name, sponsor_image, website, id];

    pool.query(query, values, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'sponsor not found' });
        }
        return res.status(200).json({ message: 'sponsor updated successfully', name, sponsor_image, website });
    });
});

// Route to delete a sponsor by ID
sponsorRouter.delete('/sponsors/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM sponsors WHERE sponsor_id = ?';

    pool.query(query, [id], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'sponsor not found' });
        }
        return res.status(200).json({ message: 'sponsor deleted successfully' });
    });
});


// Get all sponsors
sponsorRouter.get('/sponsors', (req, res) => {
    const query = 'SELECT * FROM sponsors';
    
    pool.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }
        return res.status(200).json(results);
    });
});

export default sponsorRouter;
