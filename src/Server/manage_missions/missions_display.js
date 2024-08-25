import db from "../config_db.js"; // Import the database configuration to enable queries

// Function to fetch data for mission cards for the front end
export const fetchMissionsCards = (req, res) => {
  /**
   * Updated SQL Query Explanation:
   * - The query selects all fields from the 'missions' table.
   * - Joins with the 'chains'  table to get the chain names.
   * - Joins with the 'sponsors' table to get the sponsor image.
   * - The resulting fields include chain name  as well as the sponsor image.
   */
  const query = `
    SELECT 
      missions.*,                   
      sponsors.sponsor_image AS sponsor_img,
      chain.name AS chain    
    FROM 
      missions
    LEFT JOIN 
      sponsors ON missions.sponsor_id = sponsors.sponsor_id
    LEFT JOIN
      categories ON missions.chain_id = chains.chain_id
    LEFT JOIN
      categories ON missions.subcategory_id = subcategories.subcategory_id
    
  `;

  // Execute the SQL query using the database connection
  db.query(query, (err, results) => {
    if (err) {
      // Log the error and send a 500 status code if the query fails
      console.error('Database query error:', err);
      res.status(500).send('Database query failed');
      return;
    }
    // Send the query results as a JSON response
    res.json(results);
  });
};

// Function to fetch categories for the main filter
export const fetchCategories = (req, res) => {
  /**
   * SQL Query Explanation:
   * - The query selects all fields from the 'categories' table.
   */
  const query = `
    SELECT 
      category_id,
      name
    FROM 
      categories
  `;

  // Execute the SQL query using the database connection
  db.query(query, (err, results) => {
    if (err) {
      // Log the error and send a 500 status code if the query fails
      console.error('Database query error:', err);
      res.status(500).send('Database query failed');
      return;
    }
    // Send the query results as a JSON response
    res.json(results);
  });
};