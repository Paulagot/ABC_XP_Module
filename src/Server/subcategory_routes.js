// subcategoryRoutes.js
// admin end
// this is for manage subcategories form

import express from 'express';
import db from './config_db.js';

const subCategoryRouter = express.Router();

// Create a new subcategory
subCategoryRouter.post('/subcategories', (req, res) => {
    const { name, description } = req.body;

    
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    if (!description) {
        return res.status(400).json({ error: 'Description is required' });
    }

     // Check for duplicate name
     const checkDuplicateQuery = 'SELECT COUNT(*) as count FROM subcategories WHERE name = ?';
     db.query(checkDuplicateQuery, [name], (err, results) => {
         if (err) {
             console.error('Database query error:', err);
             return res.status(500).json({ error: 'Database error', details: err });
         }
         if (results[0].count > 0) {
             return res.status(409).json({ error: 'Subcategory name already exists' });
         }

       // Insert new subcategory
       const query = 'INSERT INTO subcategories (name, description, created_at, updated_at) VALUES (?, ?, NOW(), NOW())';
       const values = [name, description];

       db.query(query, values, (err, result) => {
           if (err) {
               console.error('Database query error:', err);
               return res.status(500).json({ error: 'Database error', details: err });
           }
           return res.status(201).json({ id: result.insertId, name, description });
       });
   });
});

// Search subcategories by name
subCategoryRouter.get('/subcategories/search', (req, res) => {
    const { q } = req.query;
    const query = 'SELECT * FROM subcategories WHERE name LIKE ?';
    const values = [`%${q}%`];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }
        return res.status(200).json(results);
    });
});

// Route to update an existing subcategory
subCategoryRouter.put('/subcategories/:id', (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    // Check if name or description is empty
    if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required.' });
    }

    const query = 'UPDATE subcategories SET name = ?, description = ?, updated_at = NOW() WHERE subcategory_id = ?';
    const values = [name, description, id];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Subcategory not found' });
        }
        return res.status(200).json({ message: 'Subcategory updated successfully', name, description });
    });
});

// Route to delete a subcategory by ID
subCategoryRouter.delete('/subcategories/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM subcategories WHERE subcategory_id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Subcategory not found' });
        }
        return res.status(200).json({ message: 'Subcategory deleted successfully' });
    });
});


// Get all subcategories
subCategoryRouter.get('/subcategories', (req, res) => {
    const query = 'SELECT * FROM subcategories';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }
        return res.status(200).json(results);
    });
});

export default subCategoryRouter;
