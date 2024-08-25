import express from "express";
import { fetchBitesCards, fetchCategories } from "./coursedisplay_controller.js";

const courseDisplayRoutes = express.Router();

// Route to fetch bites cards data to display to the end user
courseDisplayRoutes.get('/bitescards', fetchBitesCards);

// Route to fetch category filter data
courseDisplayRoutes.get('/categories', fetchCategories);

export default courseDisplayRoutes;
