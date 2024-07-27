import express from "express";
import { fetchData } from "./api_controller.js";

const apiRoutes = express.Router();

// Define the route to fetch and process data
apiRoutes.get('/fetch-data', fetchData);

export default apiRoutes;

