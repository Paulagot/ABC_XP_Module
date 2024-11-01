// mission_progress.js
import axios from 'axios';

/**
 * Fetches detailed progress for a specific mission for a user, filtered by email.
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
      console.log(`Fetching mission progress for missionZenlerId: ${missionZenlerId}, page: ${pageIndex}`);

      const response = await axios.get('https://ABlockOfCrypto.newzenler.com/api/v1/reports/course-progress/detailed', {
        headers: {
          'X-API-Key': 'ONPDVVIYMEGX6WHFL1QCEJ7KN798IXV2',
          'X-Account-Name': 'ABlockOfCrypto',
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
