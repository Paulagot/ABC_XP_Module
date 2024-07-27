import express from "express";
import { fetchBitesCards } from "./coursedisplay_controller.js";

const courseDisplayRoutes = express.Router();

// Route to fetch bites cards data
courseDisplayRoutes.get('/bitescards', fetchBitesCards);

export default courseDisplayRoutes;
