// mission_progress.js
import axios from 'axios';

/**
 * Fetches detailed progress for a specific mission for a user, filtered by email.
 * This function dynamically accepts a `missionZenlerId` parameter and user email for 
 * Zenler API pagination and email filtering.
 *
 * @param {string} missionZenlerId - The unique Zenler ID for the mission.
 * @param {string} email - The email of the logged-in user.
 * @returns {Promise<Object|null>} - Returns an object containing the user's mission progress data, or null on error.
 */
export const getMissionProgress = async (missionZenlerId, email) => {
  let allItems = {};         // Stores accumulated user progress data
  let pageIndex = 1;         // Page index for Zenler API pagination
  let hasMorePages = true;   // Continue pagination while pages remain

  while (hasMorePages) {
    try {
      console.log(`Fetching mission progress for missionZenlerId: ${missionZenlerId}, page: ${pageIndex}`);

      // Zenler API request with email filter and course_id
      const response = await axios.get('https://ABlockOfCrypto.newzenler.com/api/v1/reports/course-progress/detailed', {
        headers: {
          'X-API-Key': 'ONPDVVIYMEGX6WHFL1QCEJ7KN798IXV2',
          'X-Account-Name': 'ABlockOfCrypto',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        params: { course_id: missionZenlerId, page: pageIndex, email_like: email }
      });

      // Check if response contains progress data for the requested email
      if (response.data.data && response.data.data.items) {
        Object.assign(allItems, response.data.data.items); // Aggregate data from the current page
        const { pagination } = response.data.data;

        // Continue if more pages are available
        hasMorePages = pagination.page_index < pagination.total_pages;
        pageIndex++; // Move to the next page if available
      } else {
        hasMorePages = false;
      }
    } catch (error) {
      console.error(`Error fetching mission progress for missionZenlerId ${missionZenlerId}:`, error);
      return null; // Return null if an error occurs
    }
  }

  console.log(`Fetched all pages for missionZenlerId ${missionZenlerId}`);
  return allItems; // Return full progress data for the mission
};

