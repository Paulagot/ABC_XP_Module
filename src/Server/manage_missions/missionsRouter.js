import express from 'express';
import pool from '../config_db.js'; // Ensure correct path

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

missionsRouter.put('/missions/:id', async (req, res) => {
  const { id } = req.params;
  const { xp, sponsor_id, chain_id, subcategory_id, published } = req.body;


  if (!xp) {
    return res.status(400).json({ error: 'XP is required.' });
  }

  if (!subcategory_id) {
    return res.status(400).json({ error: 'Subcategory is required.' });
  }

  try {
    // Validate `landing_page_url` only if publishing
    if (published) {
      const [rows] = await pool.promise().query(
        `SELECT landing_page_url FROM missions WHERE mission_id = ?`,
        [id]
      );

      if (!rows.length || !rows[0].landing_page_url) {
        return res.status(400).json({ error: 'Landing Page URL is required to publish this mission.' });
      }
    }

    // Build the query dynamically to avoid overwriting `landing_page_url`
    const query = `
      UPDATE missions 
      SET 
        xp = ?, 
        sponsor_id = ?, 
        chain_id = ?, 
        subcategory_id = ?, 
        published = ?, 
        updated_at = NOW() 
      WHERE mission_id = ?
    `;
    const values = [
      xp,
      sponsor_id || null,
      chain_id || null,
      subcategory_id,
      published,
      id,
    ];

    const [results] = await pool.promise().query(query, values);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    res.status(200).json({
      message: 'Mission updated successfully',
      xp,
      sponsor_id,
      chain_id,
      subcategory_id,
      published,
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Database error', details: error });
  }
});


  // Add this route to fetch unpublished missions
  missionsRouter.get('/missions/unpublished', (req, res) => {
    const query = 'SELECT name FROM missions WHERE published = 0';
  
    pool.query(query, (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: 'Database error', details: err });
      }
      if (results.length === 0) {
        return res.status(200).json([]); // Return an empty array for no results
      }
      return res.status(200).json(results);
    });
    
  });

 //  this route to fetch  missions by id

missionsRouter.get('/missions/:id', (req, res) => {
  const { id } = req.params;
 

  const query = `
    SELECT mission_id, name, xp, sponsor_id, chain_id, subcategory_id, published, landing_page_url 
    FROM missions 
    WHERE mission_id = ?
  `;

  pool.query(query, [id], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database error', details: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    return res.status(200).json(results[0]);
  });
});

export default missionsRouter;

