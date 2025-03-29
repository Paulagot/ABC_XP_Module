// File: getCourseProgress.js
import axios from 'axios';
import qs from "qs"; // Install qs with `npm install qs`

import dotenv from 'dotenv';

dotenv.config()

/**
 * Fetch course progress data from Zenler API.
 * @param {string} zenlerId - The Zenler course ID.
 * @param {string} email - The user's email address.
 * @param {string} startDate - The start date in YYYY-MM-DD format.
 * @param {string} endDate - The end date in YYYY-MM-DD format.
 * @returns {Promise<Object|null>} - Returns progress data or null if an error occurs.
 */
export const getCourseProgress = async (courseId, email, startDate, endDate) => {
    const API_URL = process.env.ZENLER_ALL_BYTE_PROGRESS_URL;
    const API_KEY = process.env.ZENLER_API_KEY;
    const ACCOUNT_NAME = process.env.ZENLER_ACCOUNT_NAME;

    // Validate required parameters
    if (!courseId || !email || !startDate || !endDate) {
        console.error("[getCourseProgress] Missing required parameters:", {
            courseId,
            email,
            startDate,
            endDate,
        });
        throw new Error("Missing required parameters for getCourseProgress");
    }

    // Build query string
    const params = {
        course_id: courseId,
        "email_is[]": email, // Check API docs to ensure this format is valid
        start_date: startDate,
        end_date: endDate,
        limit: 1,
    };

    const queryString = qs.stringify(params); // Safely encode query string

    try {
      

        const response = await axios.get(`${API_URL}?${queryString}`, {
            headers: {
                "X-API-Key": API_KEY,
                "X-Account-Name": ACCOUNT_NAME,
                "Content-Type": "application/json",
            },
        });

        if (response.status === 200) {
           
            return response.data;
        } else {
            console.error("[getCourseProgress] Unexpected status code:", response.status);
            return null;
        }
    } catch (error) {
        console.error("[getCourseProgress] Error during API request:", error.response?.data || error.message);
        throw error;
    }
};