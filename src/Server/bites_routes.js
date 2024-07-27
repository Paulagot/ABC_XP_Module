import express from 'express';
import db from './config_db.js';

const bitesRouter = express.Router();

// Search bites by name
bitesRouter.get('/bites/search', (req, res) => {
  const { q } = req.query;
  const query = 'SELECT * FROM bites WHERE name LIKE ?';
  const values = [`%${q}%`];

  db.query(query, values, (err, results) => {
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
    const { points, category_id, subcategory_id, player_url, sponsor_id, published } = req.body;

    // Log incoming data
    console.log('Update request received for bite_id:', id);
    console.log('Update data:', req.body);

    // Check if required fields are present
    if (!points || !category_id || !subcategory_id || !player_url) {
        return res.status(400).json({ error: 'Points, category_id, subcategory_id, and player_url are required.' });
    }

    const query = 'UPDATE bites SET points = ?, category_id = ?, subcategory_id = ?, player_url = ?, sponsor_id = ?, published = ?, updated_at = NOW() WHERE bite_id = ?';
    const values = [points, category_id, subcategory_id, player_url, sponsor_id, published, id];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Bite not found' });
        }
        return res.status(200).json({ message: 'Bite updated successfully', points, category_id, subcategory_id, player_url, sponsor_id, published });
    });
});

// Fetch all categories
bitesRouter.get('/categories', (req, res) => {
  const query = 'SELECT * FROM categories';

  db.query(query, (err, results) => {
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

  db.query(query, (err, results) => {
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
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }
        return res.status(200).json(results);
    });
});

export default bitesRouter;



