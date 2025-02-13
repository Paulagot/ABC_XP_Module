// File: generateDateRange.js
/**
 * Generate a date range for the Zenler API call.
 * @returns {Object} - Returns an object with `start_date` and `end_date` in YYYY-MM-DD format.
 */
export const generateDateRange = () => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const formatDate = (date) => date.toISOString().split('T')[0]; // Format YYYY-MM-DD

    return {
        start_date: formatDate(sevenDaysAgo),
        end_date: formatDate(today),
    };
};
