// subcategoryRoutes.js
// admin end
// this is for manage subcategories form

import express from 'express';
import pool from './config_db.js';

const subCategoryRouter = express.Router();

// Create a new subcategory
subCategoryRouter.post('/subcategories', (req, res) => {
    const { name } = req.body;

    
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
   

     // Check for duplicate name
     const checkDuplicateQuery = 'SELECT COUNT(*) as count FROM subcategories WHERE name = ?';
     pool.query(checkDuplicateQuery, [name], (err, results) => {
         if (err) {
             console.error('Database query error:', err);
             return res.status(500).json({ error: 'Database error', details: err });
         }
         if (results[0].count > 0) {
             return res.status(409).json({ error: 'Subcategory name already exists' });
         }

       // Insert new subcategory
       const query = 'INSERT INTO subcategories (name,  created_at, updated_at) VALUES (?,  NOW(), NOW())';
       const values = [name];

       pool.query(query, values, (err, result) => {
           if (err) {
               console.error('Database query error:', err);
               return res.status(500).json({ error: 'Database error', details: err });
           }
           return res.status(201).json({ id: result.insertId, name });
       });
   });
});

// Search subcategories by name
subCategoryRouter.get('/subcategories/search', (req, res) => {
    const { q } = req.query;
    const query = 'SELECT * FROM subcategories WHERE name LIKE ?';
    const values = [`%${q}%`];

    pool.query(query, values, (err, results) => {
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
    const { name} = req.body;

    // Check if name  is empty
    if (!name)  {
        return res.status(400).json({ error: 'Name is required.' });
    }

    const query = 'UPDATE subcategories SET name = ?, updated_at = NOW() WHERE subcategory_id = ?';
    const values = [name,  id];

    pool.query(query, values, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Subcategory not found' });
        }
        return res.status(200).json({ message: 'Subcategory updated successfully', name });
    });
});

// Route to delete a subcategory by ID
subCategoryRouter.delete('/subcategories/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM subcategories WHERE subcategory_id = ?';

    pool.query(query, [id], (err, results) => {
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
    
    pool.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }
        return res.status(200).json(results);
    });
});

export default subCategoryRouter;
