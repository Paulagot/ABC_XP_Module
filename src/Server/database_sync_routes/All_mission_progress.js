// mission_progress.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config()

/**
 * Fetches detailed progress for a specific mission for a user
 * This function dynamically accepts a `missionZenlerId` parameter and user email for 
 * Zenler API pagination and email filtering.
 *
/**
 * Fetches detailed progress for all users for a specific mission.
 * Handles pagination for complete data retrieval.
 *
 * @param {string} missionZenlerId - Unique Zenler mission ID.
 * @returns {Promise<Object>} - Returns an object with all user progress data.
 */
export const getAllMissionProgress = async (missionZenlerId) => {
  let allItems = {};
  let pageIndex = 1;
  let hasMorePages = true;

  while (hasMorePages) {
    try {
      

      const response = await axios.get(process.env.ZENLER_ALL_BYTE_PROGRESS_URL, {
        headers: {
          'X-API-Key':process.env.ZENLER_API_KEY,
          'X-Account-Name':process.env.ZENLER_ACCOUNT_NAME,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        params: {
          course_id: missionZenlerId,
          page: pageIndex
        }
      });

      if (response.data.data && response.data.data.items) {
        Object.assign(allItems, response.data.data.items);
        const { pagination } = response.data.data;

        hasMorePages = pagination.page_index < pagination.total_pages;
        pageIndex++;
      } else {
        hasMorePages = false;
      }
    } catch (error) {
      console.error(`Error fetching mission progress for missionZenlerId ${missionZenlerId}:`, error);
      return null;
    }
  }

  return allItems;
};
