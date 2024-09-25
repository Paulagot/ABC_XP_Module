import express from "express";
import cors from "cors";
import courseapiRoutes from "./courseapi.js";
import db from "./config_db.js";
import courseDisplayRoutes from "./coursedisplayapi.js";
import subCategoryRouter from "./subcategory_routes.js";
import bitesRouter from "./bites_routes.js";
import sponsorRouter from "./sponsor_routes.js";
import fetchSubcategorierouter from "./subcategory_filter_routes.js";
import missionsSearchRouter from "../Server/manage_missions/mission_search.js"
import missionsRouter from "./manage_missions/missionsRouter.js";
import chainRouter from "./chains_routes.js";
import criteriaRouter from "./criteria_router.js";
import userapiRoutes from "./userapi.js";
import missionDisplayRoutes from "./manage_missions/missions_display_api.js"
import UserBytesRouter from "./user_bites_routes.js"
import UserMissionsRouter from "./user_mission_routes.js";
import UserCompletedMissionsRouter from "./user_completed_missions.js";
import UserBytesCardsRouter from "./user_bytes_cards.js";



const app = express();
const port = 3000;

// Enable CORS for the frontend running on localhost:3001
app.use(cors({
  origin: 'http://localhost:5173'
}));

// Middleware to parse JSON bodies
app.use(express.json());


// Use API routes
app.use('/api', courseapiRoutes); // this route is for getting the bites/missions data from zenler
app.use('/api', userapiRoutes); // this route is for getting the user data from zenler
app.use('/api', courseDisplayRoutes); // this route is for the bitescards
app.use('/api', subCategoryRouter); // this route is for subcategory CRUD operations
app.use('/api', bitesRouter); // this route is for bites CRUD operations
app.use('/api', sponsorRouter); // this route is for sponsor/partner CRUD operations
app.use('/api/fetchsubcategories', fetchSubcategorierouter); // this route is for fetching subcategories for the filters on bites and missions
app.use('/api/missions', missionsSearchRouter);
app.use('/api', missionsRouter); // this route is for mission CRUD operations
app.use ('/api', chainRouter); // this route is for chains CRUD operations
app.use ('/api',criteriaRouter); // this route is for criteria CRUD operations
app.use ('/api',missionDisplayRoutes); // this route is for the missioncards
app.use ('/api', UserBytesRouter); // this route is for the user/bites data
app.use ('/api', UserMissionsRouter); // this route is for the user/missions data
app.use ('/api',UserCompletedMissionsRouter);// this route is for the user completed missions data
app.use ('/api', UserBytesCardsRouter)



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



