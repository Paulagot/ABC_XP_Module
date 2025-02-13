import pool from "./config_db.js"; // Import the database configuration to enable queries

// Function to fetch data for bites cards
export const fetchBitesCards = (req, res) => {
  /**
   * Updated SQL Query Explanation:
   * - The query selects all fields from the 'bites' table.
   * - Joins with the 'categories' and 'subcategories' tables to get the category and subcategory names.
   * - Joins with the 'sponsors' table to get the sponsor image.
   * - The resulting fields include category and subcategory names, as well as the sponsor image.
   */
  const query = `
    SELECT 
      bites.*,                   
      sponsors.sponsor_image AS sponsor_img,
      categories.name AS category,
      subcategories.name AS subcategory
    FROM 
      bites
    LEFT JOIN 
      sponsors ON bites.sponsor_id = sponsors.sponsor_id
    LEFT JOIN
      categories ON bites.category_id = categories.category_id
    LEFT JOIN
      subcategories ON bites.subcategory_id = subcategories.subcategory_id
      WHERE 
  bites.published = true;
  `;

  // Execute the SQL query using the database connection
  pool.query(query, (err, results) => {
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
  pool.query(query, (err, results) => {
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