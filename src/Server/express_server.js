import express from 'express';
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
import userapiRoutes from "./database_sync_routes/users_api.js";
import missionDisplayRoutes from "./manage_missions/missions_display_api.js"
import UserBytesRouter from "./user_bites_routes.js"
import UserMissionsRouter from "./user_mission_routes.js";
import UserCompletedMissionsRouter from "./user_completed_missions.js";
import UserBytesCardsRouter from "./user_bytes_cards.js";
import WebhookByteStatusRouter from "./user_bytes_stats_update.js";
import WebhookMissionStatusRouter from "./user_missions_stats_update.js";
import leaderboardRouter from './leaderboard.js';
import userProfileRouter from './user_profile.js';
import Registerrouter from "./registar_router.js";
import sessionRouter from "./session_router.js";
import session from 'express-session';  // Import express-session
import { ConnectSessionKnexStore } from "connect-session-knex"
import knexConstructor from "knex";
import missionprogressrouter from './zenler_progress_updates/missions_progress_endpoint.js';
import userprogressrouter from './../Server/zenler_progress_updates/Bytes_progress_endpoint.js'
import allmissionprogressrouter from './../Server/database_sync_routes/all_missions_progress_endpoint.js'
import alluserprogressrouter from './database_sync_routes/all_Bytes_progress_endpoint.js'


// Create the express app
const app = express();
const port = 3000;

// Configure CORS
const allowedOrigins = [
  'https://ablockofcrypto.com', // Replace with your Zenler domain
  'http://localhost:5173'       // Allow localhost for development
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Allow cookies and sessions from cross-origin requests
}));

// **Configure session middleware** - Add this below the CORS setup
// Initialize the session store using Knex
const store = new ConnectSessionKnexStore({
  knex: knexConstructor({
    client: 'mysql2',  // or 'pg' for PostgreSQL
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'Tra1ning',
    database: 'xp_module'
  }
})
});

// Configure session middleware with Knex as the session store
app.use(session({
  store,  // Use the SQL-based session store
  secret: '1234567890',  // Replace with a strong secret key
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,  // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24  // 1 day session duration
  }
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
app.use ('/api', UserBytesCardsRouter);
app.use('/api', WebhookByteStatusRouter); //this route is for updating the user bytes status when a byte is started or complete
app.use('/api', WebhookMissionStatusRouter); //this route is for updating the user mission status when a mission is started or complete
app.use('/api', leaderboardRouter); //this route calcaultes the leaderboard
app.use('/api',userProfileRouter);
app.use('/api',Registerrouter); // this route is used for the sign in/sign up/reset password options
app.use('/session', sessionRouter); // All session-related routes will be prefixed with /session
app.use('/api',missionprogressrouter); // this route updates the db with learner mission progress from zenler
app.use('/api',userprogressrouter); // this route updates the db with learner byte progress from zenler
app.use('/api', allmissionprogressrouter); //this route syncs the DB with zenler for user progress on missions
app.use('/api', alluserprogressrouter); //this route syncs the DB with zenler for user progress on bytes



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



