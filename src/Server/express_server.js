import express from "express";
import cors from "cors";
import apiRoutes from "./api.js";
import db from "./config_db.js";
import courseDisplayRoutes from "./coursedisplayapi.js";
import subCategoryRouter from "./subcategory_routes.js";
import bitesRouter from "./bites_routes.js";
import sponsorRouter from "./sponsor_routes.js";




const app = express();
const port = 3000;

// Enable CORS for the frontend running on localhost:3001
app.use(cors({
  origin: 'http://localhost:5173'
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Use API routes
app.use('/api', apiRoutes); // this route is for getting the bites/missions data from zenler
app.use('/api', courseDisplayRoutes); // this route is for the bitescards
app.use('/api', subCategoryRouter); // this route is for subcategory CRUD operations
app.use('/api', bitesRouter); // this route is for subcategory CRUD operations
app.use('/api', sponsorRouter); // this route is for sponsor/partner CRUD operations

// Basic route to test server is working
app.get('/', (req, res) => {
  res.send('Express server is running!');
});

// Test the database connection with a simple query
app.get('/test-db', (req, res) => {
  db.query('SELECT 1', (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).send('Database query failed');
      return;
    }
    res.send('Database connection is working!');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});



