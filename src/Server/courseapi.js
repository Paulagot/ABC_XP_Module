import express from "express";
import { fetchCourseData } from "./course_api_controller.js";

const courseapiRoutes = express.Router();

// Define the route to fetch and process data from the zenler api for bytes and missions.
courseapiRoutes.get('/fetch-data', fetchCourseData);

export default courseapiRoutes;

