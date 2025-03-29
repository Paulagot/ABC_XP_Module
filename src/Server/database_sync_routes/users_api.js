import express from "express";
import { fetchUsersData } from "../database_sync_routes/users_api_controller.js"

const userapiRoutes = express.Router();

// Define the route to fetch and process data from the zenler api for end user data for the users table

userapiRoutes.get('/fetch-users-data', fetchUsersData);

export default userapiRoutes;

