import express from 'express';
import pool from './config_db.js';

const criteriaRouter = express.Router();

// Get criteria by mission_id with bite_name and subcategory_name
criteriaRouter.get('/criteria', (req, res) => {
    const { mission_id } = req.query;
    const query = `
        SELECT 
            c.*, 
            b.name AS bite_name, 
            s.name AS subcategory_name 
        FROM 
            criteria c
        LEFT JOIN 
            bites b ON c.bite_id = b.bite_id
        LEFT JOIN 
            subcategories s ON c.subcategory_id = s.subcategory_id
        WHERE 
            c.mission_id = ?
    `;
    
    pool.query(query, [mission_id], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }
        if (results.length === 0) {
            return res.status(200).json([]);
        }
        return res.status(200).json(results);
    });
});

// Create a new criterion
criteriaRouter.post('/criteria', (req, res) => {
  

    // Extract the mapped keys from the request body
    const { mission_id, condition_type, criteria_type, bite_id, subcategory_id, lp_value } = req.body;

    let query;
    let values;

    if (criteria_type === 'Bite Complete') {
        query = `INSERT INTO criteria 
                 (mission_id, condition_type, criteria_type, bite_id, subcategory_id, lp_value, created_at, updated_at) 
                 VALUES (?, ?, ?, ?, NULL, NULL, NOW(), NOW())`;
        values = [mission_id, condition_type, criteria_type, bite_id];
    } else if (criteria_type === 'LP Required') {
        query = `INSERT INTO criteria 
                 (mission_id, condition_type, criteria_type, bite_id, subcategory_id, lp_value, created_at, updated_at) 
                 VALUES (?, ?, ?, NULL, ?, ?, NOW(), NOW())`;
        values = [mission_id, condition_type, criteria_type, subcategory_id, lp_value];
    } else {
        return res.status(400).json({ error: 'Invalid criteria type' });
    }


    pool.query(query, values, (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }
        return res.status(201).json({ message: 'Criterion created successfully', id: result.insertId });
    });
});


// Update an existing criterion
criteriaRouter.put('/criteria/:id', (req, res) => {
    const { id } = req.params;
    const { condition_type, criteria_type, bite_id, subcategory_id,  lp_value } = req.body;

    const query = `UPDATE criteria 
                  SET condition_type = ?, criteria_type = ?, bite_id = ?, subcategory_id = ?,  lp_value = ?, updated_at = NOW() 
                  WHERE criteria_id = ?`;

    const values = [condition_type, criteria_type, bite_id, subcategory_id,  lp_value, id];

    pool.query(query, values, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Criterion not found' });
        }
        return res.status(200).json({ message: 'Criterion updated successfully' });
    });
});

// Delete a criterion by criteria_id
criteriaRouter.delete('/criteria/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM criteria WHERE criteria_id = ?';

    pool.query(query, [id], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Criterion not found' });
        }
        return res.status(200).json({ message: 'Criterion deleted successfully' });
    });
});

// Get all criteria
criteriaRouter.get('/criteria/all', (req, res) => {
    const query = `
        SELECT 
            c.*, 
            b.name AS bite_name, 
            s.name AS subcategory_name 
        FROM 
            criteria c
        LEFT JOIN 
            bites b ON c.bite_id = b.bite_id
        LEFT JOIN 
            subcategories s ON c.subcategory_id = s.subcategory_id
    `;
    
    pool.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }
        return res.status(200).json(results);
    });
});

// Get criteria by mission_id
criteriaRouter.get('/criteria/mission/:mission_id', (req, res) => {
    const { mission_id } = req.params;

    const query = `
        SELECT 
            c.*, 
            b.name AS bite_name, 
            s.name AS subcategory_name 
        FROM 
            criteria c
        LEFT JOIN 
            bites b ON c.bite_id = b.bite_id
        LEFT JOIN 
            subcategories s ON c.subcategory_id = s.subcategory_id
        WHERE 
            c.mission_id = ?
    `;
    
    pool.query(query, [mission_id], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }
        if (results.length === 0) {
            return res.status(200).json([]); // Return empty array if no criteria found
        }
        return res.status(200).json(results);
    });
});


export default criteriaRouter;
