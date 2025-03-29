import express from "express";
import { fetchMissionsCards, fetchCategories } from "./missions_display.js";

const missionDisplayRoutes = express.Router();

// Route to fetch mission cards data to display to the end user
missionDisplayRoutes.get('/missionscards', fetchMissionsCards);

// Route to fetch category filter data
missionDisplayRoutes.get('/categories', fetchCategories);

export default missionDisplayRoutes;
