import express from "express";
import { fetchUserData } from "./user_api_controller.js";

const userapiRoutes = express.Router();

// Define the route to fetch and process data from the zenler api for bytes and missions.
userapiRoutes.get('/fetch-user-data', fetchUserData);

export default userapiRoutes;

