import express from 'express';
import db from '../config_db.js'; // Ensure correct path

// admin end to update missions from manage missions

const missionsRouter = express.Router();

// Route to update an existing mission
missionsRouter.put('/missions/:id', (req, res) => {
    const { id } = req.params;
    const { xp, sponsor_id, chain_id, subcategory_id, published } = req.body;

    // Log incoming data
    console.log('Update request received for mission_id:', id);
    console.log('Update data:', req.body);

    // Check if required fields are present
    if (!xp) {
        return res.status(400).json({ error: 'XP is required.' });
    }

     
      if (!subcategory_id) {
        return res.status(400).json({ error: 'subcategory is required.' });
    }

    const query = `
        UPDATE missions 
        SET xp = ?, sponsor_id = ?, chain_id = ?, subcategory_id = ?, published = ?, updated_at = NOW() 
        WHERE mission_id = ?
    `;
    const values = [xp, sponsor_id || null,  chain_id || null, subcategory_id, published, id];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Mission not found' });
        }
        return res.status(200).json({ message: 'Mission updated successfully', xp, sponsor_id, chain_id, subcategory_id, published });
    });
});

export default missionsRouter;
