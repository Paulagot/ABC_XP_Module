import dotenv from "dotenv";

// ✅ Load the correct environment file BEFORE anything else
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
dotenv.config({ path: envFile });

console.log(`✅ Successfully loaded environment from: ${envFile}`);




import express from 'express';
import cors from "cors";
import pool from "./src/Server/config_db.js";
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fs from 'node:fs';
import session from 'express-session';  // Import express-session
import courseapiRoutes from "./src/Server/courseapi.js";
import courseDisplayRoutes from "./src/Server/coursedisplayapi.js";
import subCategoryRouter from "./src/Server/subcategory_routes.js";
import bitesRouter from "./src/Server/bites_routes.js";
import sponsorRouter from "./src/Server/sponsor_routes.js";
import fetchSubcategorierouter from "./src/Server/subcategory_filter_routes.js";
import missionsSearchRouter from "./src/Server/manage_missions/mission_search.js"
import missionsRouter from "./src/Server/manage_missions/missionsRouter.js";
import chainRouter from "./src/Server/chains_routes.js";
import criteriaRouter from "./src/Server/criteria_router.js";
import userapiRoutes from "./src/Server/database_sync_routes/users_api.js";
import missionDisplayRoutes from "./src/Server/manage_missions/missions_display_api.js"
import UserBytesRouter from "./src/Server/user_bites_routes.js"
import UserMissionsRouter from "./src/Server/user_mission_routes.js";
import UserCompletedMissionsRouter from "./src/Server/user_completed_missions.js";
import UserBytesCardsRouter from "./src/Server/user_bytes_cards.js";
import WebhookByteStatusRouter from "./src/Server/user_bytes_stats_update.js";
import WebhookMissionStatusRouter from "./src/Server/user_missions_stats_update.js";
import leaderboardRouter from './src/Server/leaderboard.js';

import Registerrouter from "./src/Server/registar_router.js";
import sessionRouter from "./src/Server/session_router.js";
import allmissionprogressrouter from './src/Server/database_sync_routes/all_missions_progress_endpoint.js'
import alluserprogressrouter from './src/Server/database_sync_routes/all_Bytes_progress_endpoint.js'
import MissionUnlockRouter from './src/Server/user_mission_unlock_router.js';
import Sales_page_router from './src/Server/sales_page_routes.js';
import ProgressRouter from './src/Server/zenler_progress_updates/progressRouter.js';
import sitemapRouter from './src/Server/sitemap_routes.js'
import bitesReportRouter from './src/Server/admin_dash_bytes_reports_router.js'
import missionsReportRouter from  './src/Server/admin_dash_missions_report_router.js'
import user_dashboard_router from './src/Server/user_dashboard.js'


// Load environment variables
// dotenv.config();

// Then load environment-specific file
// const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
// try {
//   dotenv.config({ path: `./${envFile}` });
//   console.log(`Successfully loaded environment from: ${envFile}`);
// } catch (error) {
//   console.warn(`Warning: Could not load ${envFile}. Using default .env file.`);
// }

// Environment configuration
const isDevelopment = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || (isDevelopment ? 3000 : 3000);
const apiBaseUrl = process.env.API_BASE_URL || (isDevelopment ? 'http://localhost:3000' : 'http://localhost:3000');
const appUrl = process.env.APP_URL || (isDevelopment ? 'http://localhost:5173' : 'http://localhost:3000');

console.log(`Backend running in ${process.env.NODE_ENV} mode on port ${port}`);
console.log('🚀 Database Connection Details:');
console.log('Loaded ENV File: ', process.env.NODE_ENV);
console.log('Database Host:', process.env.DATABASE_HOST);
console.log('Database User:', process.env.DATABASE_USER);
console.log('Database Name:', process.env.DATABASE_NAME);
console.log('Database Port:', process.env.DATABASE_PORT);
console.log("Database Password:", process.env.DATABASE_PASSWORD ? "SET" : "MISSING");




console.log(`Detailed Port Configuration:
  -------------------------
  PORT env variable: ${process.env.PORT}
  NODE_ENV: ${process.env.NODE_ENV}
  isDevelopment: ${isDevelopment}
  Selected port: ${port}
  -------------------------`);

console.log(`Environment Configuration:
  -------------------------
  NODE_ENV: ${process.env.NODE_ENV}
  Port: ${port}
  API Base URL: ${process.env.API_BASE_URL}
  App URL: ${process.env.APP_URL}
  Database Host: ${process.env.DATABASE_HOST}
  -------------------------`);

// Initial environment logging
console.log('Environment Configuration:');
console.log('-------------------------');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`Port: ${port}`);
console.log(`API Base URL: ${apiBaseUrl}`);
console.log(`App URL: ${appUrl}`);
console.log(`Database Host: ${process.env.DATABASE_HOST}`);
console.log('-------------------------');

// Initialize the express app
const app = express();

// Resolve __dirname and __filename for use with static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug env file loading
console.log('Current directory:', __dirname);
console.log('Looking for env file:', path.join(__dirname, envFile));
console.log('Does file exist?', fs.existsSync(path.join(__dirname, envFile)));

// Optional: Check all env files for debugging
console.log('Environment files status:');
for (const file of ['.env', '.env.development', '.env.production']) {
  console.log(`${file}: ${fs.existsSync(path.join(__dirname, file)) ? 'exists' : 'not found'}`);
}

// Add debug logging throughout your server startup
console.log('Server starting...');
console.log('__dirname:', __dirname);
console.log('Dist path:', path.join(__dirname, 'dist')); // Changed from 'public'

// Middleware to parse JSON bodies
app.use(express.json());

// CORS Configuration
const productionOrigins = [
  'https://ablockofcrypto.com',
  'https://app.ablockofcrypto.com',
  'xpmodule.c188ccsye2s8.us-east-1.rds.amazonaws.com',
   'http://localhost:3000',
  'http://abc-loadbalancer-1196555837.us-east-1.elb.amazonaws.com/'
  
];

const developmentOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001'
];

const allowedOrigins = isDevelopment 
  ? [...developmentOrigins, ...productionOrigins]
  : productionOrigins;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Initialize session store using Knex
import { ConnectSessionKnexStore } from "connect-session-knex";
import knexConstructor from "knex";

const store = new ConnectSessionKnexStore({
  knex: knexConstructor({
    client: 'mysql2',
    connection: {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    }
  })
});

// Configure session middleware
app.use(session({
  store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: !isDevelopment, // set to false for dev and true for production
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: 'lax'
  }
}));

// Middleware to enforce HTTPS
if (process.env.NODE_ENV === 'production') {
  console.log('Production mode: Enabling HTTPS enforcement');
  app.use((req, res, next) => {
    if (process.env.LOCAL_PRODUCTION === 'true' || 
        req.headers['user-agent']?.includes('ELB-HealthChecker')) {
      return next();
    }
    
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// Before serving static files, check if directory exists
const distPath = path.join(__dirname, 'dist'); // Changed from 'public'
try {
  if (fs.existsSync(distPath)) {
    console.log(`Dist directory exists at ${distPath}`);
    console.log('Contents:', fs.readdirSync(distPath));
  } else {
    console.log(`Dist directory does not exist at ${distPath}`);
  }
} catch (err) {
  console.error('Error checking dist directory:', err);
}

// Serve static files in production mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
}


// Improve health check to include basic system info
app.get('/health', (req, res) => {
  const healthInfo = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    environment: process.env.NODE_ENV
  };
  
  try {
    pool.query('SELECT 1', (err, results) => {
      if (err) {
        healthInfo.database = {
          status: 'ERROR',
          message: err.message
        };
        return res.status(500).json(healthInfo);
      }
      
      healthInfo.database = {
        status: 'OK'
      };
      return res.status(200).json(healthInfo);
    });
  } catch (error) {
    healthInfo.database = {
      status: 'ERROR',
      message: error.message
    };
    return res.status(500).json(healthInfo);
  }
});

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
app.use('/api', user_dashboard_router); //this route is for the user dashboard
app.use('/api',Registerrouter); // this route is used for the sign in/sign up/reset password options
app.use('/api', allmissionprogressrouter); //this route syncs the DB with zenler for user progress on missions
app.use('/api', alluserprogressrouter); //this route syncs the DB with zenler for user progress on bytes
app.use('/api', MissionUnlockRouter); //this route calcualtes unlocked missions for a user
app.use('/api', Sales_page_router) //this route is for updating the sales pages CRUD operations
app.use('/session', sessionRouter); // All session-related routes will be prefixed with /session
app.use('/api', ProgressRouter);
app.use('/api', sitemapRouter);
app.use('/api', bitesReportRouter);
app.use('/api', missionsReportRouter);




// Test database connection endpoint
app.get('/test-db', (req, res) => {
  console.log('Attempting database query...');
  pool.query('SELECT 1', (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).send('Database query failed');
      return;
    }
    console.log('Database query successful:', results);
    res.send('Database connection is working!');
  });
});

// Catch-all route for SPA
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html'); // Changed from 'public'
  
  try {
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    console.error(`[WARNING] Index file not found at: ${indexPath}`);
    return res.status(404).send('Application files not found. Check deployment package.');
  } catch (err) {
    console.error('[ERROR] Error serving index file:', err);
    return res.status(500).send('Server error while trying to serve application files.');
  }
});

// Start server
app.listen(port, () => {
  console.log('\nServer Startup Complete:');
  console.log('-------------------------');
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`Health check endpoint: http://localhost:${port}/health`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log('-------------------------\n');
});