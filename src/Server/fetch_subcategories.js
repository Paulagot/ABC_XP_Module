import db from "./config_db.js"; // Import the database connection

// Fetch subcategories from the database
export const fetchSubcategories = (req, res) => {
  const query = 'SELECT * FROM subcategories';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching subcategories from MySQL:', err);
      res.status(500).send('Failed to fetch subcategories');
      return;
    }
    res.status(200).json(results);
  });
};