// getCourseProgress.js
import axios from 'axios';

/**
 * Fetches detailed course progress data from the Zenler API for a specific course, 
 * filtered by a user’s email to retrieve only that user’s progress. The function 
 * handles paginated responses from the API.
 *
 * @param {string} courseId - The unique identifier (zenler_id) of the course in Zenler.
 * @param {string} email - The email address of the logged-in user to filter the results.
 * @returns {Promise<Object|null>} - Returns an object containing all user progress data 
 *                                   across pages for the specified course, or `null` in case of an error.
 */
export const getCourseProgress = async (courseId, email) => {
  let allItems = {};
  let pageIndex = 1;
  let af_v = 1;

  try {
    console.log(`Fetching course progress for courseId: ${courseId}, page: ${pageIndex}`);

    const response = await axios.get('https://ABlockOfCrypto.newzenler.com/api/v1/reports/course-progress/detailed', {
      headers: {
        'X-API-Key': 'ONPDVVIYMEGX6WHFL1QCEJ7KN798IXV2',
        'X-Account-Name': 'ABlockOfCrypto',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      params: {limit:1, course_id: courseId, page: pageIndex, af_v: af_v, 'email_is[]': email }
    });

    // Log the full response to understand what data is returned
    console.log('Full API Response:', JSON.stringify(response.data, null, 2));

    // Apply local filtering by email
    const filteredItems = Object.fromEntries(
      Object.entries(response.data.data.items).filter(([key, value]) => value.email === email)
    );

    // Merge filtered items into the main allItems object
    Object.assign(allItems, filteredItems);

    // No need to go to the next page, so remove pagination logic
  } catch (error) {
    console.error(`Error fetching course progress for courseId ${courseId}:`, error);
    return null; // Return `null` if any error occurs during the fetch
  }

  // Log the filtered data for verification
  console.log(`Filtered Data for ${email}:`, JSON.stringify(allItems, null, 2));
  return allItems; // Returns the complete progress data for the user for the specific course

  
};


  

