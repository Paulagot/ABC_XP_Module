// getAllCourseProgress.js

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config()

/**
 * Fetches detailed course progress for all users from the Zenler API for a specific course.
 * Handles paginated responses to ensure all pages of data are retrieved.
 *
 * @param {string} courseId - The unique Zenler ID of the course.
 * @returns {Promise<Object|null>} - Returns an object containing all user progress data across pages for the specified course, or `null` in case of an error.
 */
export const getAllCourseProgress = async (courseId) => {
  let allItems = {};  // Stores accumulated progress data
  let pageIndex = 1;  // Page index for Zenler API pagination
  const af_v = 1;     // Enable advanced filter
  
  try {
    while (true) {
      

      // API call to fetch course progress data
      const response = await axios.get(process.env.ZENLER_ALL_BYTE_PROGRESS_URL, {
        headers: {
          'X-API-Key': process.env.ZENLER_API_KEY,
          'X-Account-Name': process.env.ZENLER_ACCOUNT_NAME,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        params: { course_id: courseId, page: pageIndex, af_v }
      });

      if (response.data.data && response.data.data.items) {
        // Aggregate data from the current page
        Object.assign(allItems, response.data.data.items);

        const { pagination } = response.data.data;
        if (pagination.page_index >= pagination.total_pages) break;
        pageIndex++;
      } else {
        break;
      }
    }
  } catch (error) {
    console.error(`Error fetching course progress for courseId ${courseId}:`, error);
    return null;
  }

  return allItems;
};


