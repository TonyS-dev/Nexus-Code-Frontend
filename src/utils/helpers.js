/**
 * @file helpers.js
 * @description Utility functions for various data processing tasks.
 */

/**
 * Helper function to get the access level from a user object.
 * @param {object} user - The user object.
 * @returns {string} The access level, defaults to 'User'.
 */
export function getUserAccessLevel(user) {
    if (!user || !user.accessLevel) return 'User';
    return String(user.accessLevel);
}

/**
 * Helper function to format dates for input fields
 */
export function formatDateForInput(dateString) {
    if (!dateString) return '';
    try {
        // Handle both DATE and TIMESTAMP formats
        if (dateString.includes('T')) {
            // ISO format: "2022-01-10T00:00:00.000Z"
            return dateString.split('T')[0];
        } else {
            // Already in DATE format: "2022-01-10"
            return dateString;
        }
    } catch (e) {
        console.error('Error formatting date:', dateString, e);
        return '';
    }
};