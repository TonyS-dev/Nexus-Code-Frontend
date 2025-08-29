/**
 * @file api.service.js
 * @description Centralized API request handler and endpoint definitions.
 * This service provides a wrapper around the native fetch API to streamline
 * API calls, automatically handle authentication tokens, and standardize error handling.
 */
import { auth } from './auth.service.js';

// The base URL for the API is retrieved from environment variables.
// This allows for easy configuration between development and production environments.
const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * A centralized fetch wrapper for making API requests.
 * It automatically adds the authorization header and handles common response scenarios.
 * @param {string} path - The API endpoint path (e.g., '/employees').
 * @param {string} [method='GET'] - The HTTP method for the request.
 * @param {object|null} [body=null] - The request payload for POST/PUT requests.
 * @returns {Promise<any>} The JSON response from the API.
 * @throws {Error} Throws an error if the network request fails or the API returns an error status.
 */
export async function apiRequest(path, method = 'GET', body = null) {
    const url = `${API_BASE_URL}${path}`;
    const headers = { 'Content-Type': 'application/json' };

    const token = auth.getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = { method, headers };
    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);

        // A 204 'No Content' response is successful but has no body to parse.
        if (response.status === 204) {
            return;
        }

        const data = await response.json();

        if (!response.ok) {
            // The API should return a 'message' field in its error responses.
            throw new Error(data.message || `HTTP Error: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`API request failed: ${method} ${path}`, error);
        // Re-throw the error to be caught by the calling function.
        throw error;
    }
}

// --- API Endpoint Functions ---
// Encapsulating endpoint calls into named functions improves maintainability
// and makes page components cleaner.

// Auth
export const loginUser = (credentials) =>
    apiRequest('/auth/login', 'POST', credentials);

// Employees
export const getEmployees = () => apiRequest('/employees');
export const getEmployeeById = (id) => apiRequest(`/employees/${id}`);

// Requests
export const getRequestsByEmployeeId = (employeeId) =>
    apiRequest(`/requests/employee/${employeeId}`);
export const getPendingManagerRequests = () =>
    apiRequest('/approvals/approver/pending'); // This endpoint needs to exist
export const createVacationRequest = (data) =>
    apiRequest('/requests/vacation', 'POST', data);
export const createLeaveRequest = (data) =>
    apiRequest('/requests/leave', 'POST', data);
export const createCertificateRequest = (data) =>
    apiRequest('/requests/certificate', 'POST', data);
export const approveRequest = (requestId, approvalData) =>
    apiRequest(`/requests/${requestId}/approve`, 'POST', approvalData);

// Vacation Balances
export const getVacationBalance = (employeeId) =>
    apiRequest(`/vacation-balances/employee/${employeeId}`);

// Catalogs (for populating forms)
export const getVacationTypes = () => apiRequest('/vacation-types');
export const getLeaveTypes = () => apiRequest('/leave-types');
export const getCertificateTypes = () => apiRequest('/certificate-types');
