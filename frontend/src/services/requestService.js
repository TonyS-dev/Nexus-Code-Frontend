// frontend/src/services/requestService.js
import { apiRequest } from './api.js';

export const requestService = {
    /**
     * Fetches all requests made by a specific employee.
     * @param {string} employeeId
     * @returns {Promise<Array>}
     */
    async getRequestsByEmployee(employeeId) {
        // This should point to your real backend endpoint
        return apiRequest(`/requests/employee/${employeeId}`);
    },

    /**
     * Creates a new request.
     * @param {Object} requestData - The data for the new request.
     * @returns {Promise<Object>}
     */
    async createRequest(requestData) {
        // This will be the generic endpoint to create any type of request
        return apiRequest('/requests', 'POST', requestData);
    },

    /**
     * Fetches the vacation balance for a specific employee.
     * @param {string} employeeId
     * @returns {Promise<Object>}
     */
    async getVacationBalance(employeeId) {
        return apiRequest(`/vacation-balances/employee/${employeeId}`);
    },

    // You can add more specific business logic functions here as needed,
    // like calculateBusinessDays, checkOverlap, etc.
};
