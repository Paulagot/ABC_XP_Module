import express from 'express';
import db from '../config_db.js'; // Ensure correct path

// admin end to update missions from manage missions

const missionsRouter = express.Router();

/**
 * Route to update an existing mission.
 * 
 * Endpoint: PUT /missions/:id
 * 
 * Description:
 * This route allows the update of a mission's details, including XP, sponsor, chain, subcategory, and publish status.
 * The request must include the mission ID and the updated values.
 * 
 * Parameters:
 * - id (URL Parameter): The ID of the mission to update.
 * 
 * Request Body:
 * - xp: The experience points associated with the mission.
 * - sponsor_id: The ID of the sponsor (nullable).
 * - chain_id: The ID of the chain (nullable).
 * - subcategory_id: The ID of the subcategory (required).
 * - published: The publish status of the mission (boolean, 1 for published, 0 for not published).
 * 
 * Response:
 * - Success: 200 status with a message indicating the mission was updated successfully.
 * - Failure: 400 status if required fields are missing, 500 status for database errors.
 */

missionsRouter.put('/missions/:id', (req, res) => {
  const { id } = req.params;
  const { xp, sponsor_id, chain_id, subcategory_id, published } = req.body;

  console.log('Update request received for mission_id:', id);
  console.log('Update data:', req.body);

  if (!xp) {
    return res.status(400).json({ error: 'XP is required.' });
  }

  if (!subcategory_id) {
    return res.status(400).json({ error: 'Subcategory is required.' });
  }

  const query = `
    UPDATE missions 
    SET xp = ?, sponsor_id = ?, chain_id = ?, subcategory_id = ?, published = ?, updated_at = NOW() 
    WHERE mission_id = ?
  `;
  const values = [
    xp, 
    sponsor_id || null,  // Correctly handle "None" option
    chain_id || null,    // Correctly handle "None" option
    subcategory_id, 
    published, 
    id
  ];


  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database error', details: err });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Mission not found' });
    }
    return res.status(200).json({ 
      message: 'Mission updated successfully', 
      xp, sponsor_id, chain_id, subcategory_id, published 
    });
  });
});

  // Add this route to fetch unpublished missions
missionsRouter.get('/missions/unpublished', (req, res) => {
  const query = 'SELECT name FROM missions WHERE published = 0';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database error', details: err });
    }
    return res.status(200).json(results);
  });
});



export default missionsRouter;

