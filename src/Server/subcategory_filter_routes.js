import express from "express";
import { fetchSubcategories } from "./fetch_subcategories.js";

const fetchSubcategorierouter = express.Router();

// Route to get subcategories
fetchSubcategorierouter.get("/", fetchSubcategories);

export default fetchSubcategorierouter;