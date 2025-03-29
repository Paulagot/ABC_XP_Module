// chainRoutes.js
// admin end
// this is to allow manage chains form in admin.

import express from 'express';
import pool from './config_db.js';

const chainRouter = express.Router();

// Create a new chain
chainRouter.post('/chains', (req, res) => {
    const { name, chain_image } = req.body;

    
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    if (!chain_image) {
        return res.status(400).json({ error: 'chain_image is required' });
    }
   

     // Check for duplicate name
     const checkDuplicateQuery = 'SELECT COUNT(*) as count FROM chains WHERE name = ?';
     pool.query(checkDuplicateQuery, [name], (err, results) => {
         if (err) {
             console.error('Database query error:', err);
             return res.status(500).json({ error: 'Database error', details: err });
         }
         if (results[0].count > 0) {
             return res.status(409).json({ error: 'chain name already exists' });
         }

       // Insert new chain
       const query = 'INSERT INTO chains (name, chain_image,  created_at, updated_at) VALUES (?,  ?, NOW(), NOW())';
       const values = [name, chain_image];

       pool.query(query, values, (err, result) => {
           if (err) {
               console.error('Database query error:', err);
               return res.status(500).json({ error: 'Database error', details: err });
           }
           return res.status(201).json({ id: result.insertId, name, chain_image });
       });
   });
});

// Search chains by name
chainRouter.get('/chains/search', (req, res) => {
    const { q } = req.query;
    const query = 'SELECT * FROM chains WHERE name LIKE ?';
    const values = [`%${q}%`];

    pool.query(query, values, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }
        return res.status(200).json(results);
    });
});

// Route to update an existing chain
chainRouter.put('/chains/:id', (req, res) => {
    const { id } = req.params;
    const { name, chain_image } = req.body;

    // Check if name or chain_image or  is empty
    if (!name || !chain_image ) {
        return res.status(400).json({ error: 'Name and chain_image  are required.' });
    }

    const query = 'UPDATE chains SET name = ?, chain_image = ?,   updated_at = NOW() WHERE chain_id = ?';
    const values = [name, chain_image,  id];

    pool.query(query, values, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'chain not found' });
        }
        return res.status(200).json({ message: 'chain updated successfully', name, chain_image,  });
    });
});

// Route to delete a chain by ID
chainRouter.delete('/chains/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM chains WHERE chain_id = ?';

    pool.query(query, [id], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'chain not found' });
        }
        return res.status(200).json({ message: 'chain deleted successfully' });
    });
});


// Get all chains
chainRouter.get('/chains', (req, res) => {
    const query = 'SELECT * FROM chains';
    
    pool.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }
        return res.status(200).json(results);
    });
});

export default chainRouter;