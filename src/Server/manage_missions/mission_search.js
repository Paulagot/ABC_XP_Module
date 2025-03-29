import express from 'express';
import pool from "../config_db.js";

//admin end used to search missions by name

const missionsSearchRouter = express.Router();


// Route to search for missions by name
missionsSearchRouter.get('/search', (req, res) => {
    const { name } = req.query;
  
    if (!name) {
      return res.status(400).json({ error: 'Search name is required' });
    }
  
    const query = 'SELECT * FROM missions WHERE name LIKE ?';
    pool.query(query, [`%${name}%`], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'An error occurred while searching for missions' });
      }
  
      // Log the query results to check the data being returned
     // console.log('Query Results:', results);
      res.json(results); // Ensure results are sent as an array
    });
  });
  

export default missionsSearchRouter;


  