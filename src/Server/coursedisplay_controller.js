import db from "./config_db.js";

// Function to fetch bites cards data
export const fetchBitesCards = (req, res) => {
  const query = 'SELECT * FROM bites'; // Adjust the table name if necessary

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).send('Database query failed');
      return;
    }
    res.json(results);
  });
};
