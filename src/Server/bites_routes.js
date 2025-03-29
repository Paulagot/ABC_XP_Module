import express from 'express';
import pool from './config_db.js';

// this is for the admin end and manage bytes

const bitesRouter = express.Router();

// Search bites by name
bitesRouter.get('/bites/search', (req, res) => {
  const { q } = req.query;
  const query = 'SELECT * FROM bites WHERE name LIKE ?';
  const values = [`%${q}%`];

  pool.query(query, values, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database error', details: err });
    }
    return res.status(200).json(results);
  });
});

// Get all bites
bitesRouter.get('/bites', (req, res) => {
  const query = 'SELECT * FROM bites';

 pool.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database error', details: err });
    }
    return res.status(200).json(results);
  });
});



// Route to update an existing bite
bitesRouter.put('/bites/:id', (req, res) => {
  const { id } = req.params;
  const { points, category_id, subcategory_id, sponsor_id, published } = req.body;

  

  // SQL Query: Update bite record. Note that 'player_url' is intentionally omitted,
  // and 'url' is used instead to ensure they always match.
  const query = `
    UPDATE bites 
    SET points = ?, category_id = ?, subcategory_id = ?, 
        sponsor_id = ?, published = ?, 
        player_url = url, updated_at = NOW() 
    WHERE bite_id = ?`;

  // Array of values to match SQL placeholders
  const values = [points, category_id, subcategory_id, sponsor_id || null, published, id];

  // Execute SQL query with provided values
  pool.query(query, values, (err, results) => {
      if (err) {
          console.error('Database query error:', err);
          return res.status(500).json({ error: 'Database error', details: err });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'Bite not found' });
      }
      return res.status(200).json({ message: 'Bite updated successfully', points, category_id, subcategory_id, sponsor_id, published });
  });
});

// Fetch all categories
bitesRouter.get('/categories', (req, res) => {
  const query = 'SELECT * FROM categories';

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database error', details: err });
    }
    return res.status(200).json(results);
  });
});

// Fetch all subcategories
bitesRouter.get('/subcategories', (req, res) => {
  const query = 'SELECT * FROM subcategories';

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database error', details: err });
    }
    return res.status(200).json(results);
  });
});

// Get all sponsors
bitesRouter.get('/sponsors', (req, res) => {
    const query = 'SELECT sponsor_id, name FROM sponsors';
    
    pool.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }
        return res.status(200).json(results);
    });
});

// Add this route to fetch unpublished bites
bitesRouter.get('/bites/unpublished', (req, res) => {
  const query = 'SELECT name FROM bites WHERE published = 0';

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database error', details: err });
    }
    return res.status(200).json(results);
  });
});

export default bitesRouter;





