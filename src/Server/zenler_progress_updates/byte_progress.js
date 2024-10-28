import axios from 'axios';

/**
 * Function to fetch detailed course progress data from the Zenler API.
 * This function dynamically accepts a `courseId` parameter and handles paginated responses.
 *
 * @param {number} courseId - The ID of the course to fetch progress data for.
 * @returns {Promise<Object|null>} - Returns an object containing all user progress data if successful, otherwise `null`.
 */
export const getCourseProgress = async (courseId) => {
  let allItems = {};        // Store all user progress data across pages
  let pageIndex = 1;        // Initialize page index for pagination
  let hasMorePages = true;  // Flag to continue fetching if more pages are available

  while (hasMorePages) {
    try {
      // console.log(`Fetching course progress for courseId: ${courseId}, page: ${pageIndex}`);

      // API request to Zenler to fetch course progress details for the specified page
      const response = await axios.get('https://ABlockOfCrypto.newzenler.com/api/v1/reports/course-progress/detailed', {
        headers: {
          'X-API-Key': 'ONPDVVIYMEGX6WHFL1QCEJ7KN798IXV2',
          'X-Account-Name': 'ABlockOfCrypto',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        params: { course_id: courseId, page: pageIndex } // Pass the courseId and current page number as parameters
      });

      // Check if the response contains user progress data
      if (response.data.data && response.data.data.items) {
        // Combine data items from the current page with allItems
        Object.assign(allItems, response.data.data.items);

        const { pagination } = response.data.data;
        
        // Determine if there is another page to fetch
        if (pagination.page_index < pagination.total_pages) {
          pageIndex++; // Increment to fetch the next page
        } else {
          hasMorePages = false; // No more pages to fetch
        }
      } else {
        hasMorePages = false; // End pagination if no items are found
      }
    } catch (error) {
      console.error('Error fetching course progress:', error);
      return null; // Return null if any error occurs
    }
  }

  // console.log(`Fetched all pages for courseId ${courseId}`);
  return allItems; // Return combined user progress data across all pages
};
