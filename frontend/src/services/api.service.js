/**
 * @file api.service.js
 * @description Centralized API request handler with automatic token expiration handling.
 */
import { auth } from './auth.service.js';

const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Centralized fetch wrapper. Now automatically handles 401/403 errors by logging out the user.
 * @param {string} path - The API endpoint path (e.g., '/employees').
 * @param {string} [method='GET'] - The HTTP method.
 * @param {object|null} [body=null] - The request payload.
 * @returns {Promise<any>} The JSON response from the API.
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

        if (response.status === 401 || response.status === 403) {
            auth.logout();
            // Stop further execution and prevent components from processing an error they can't handle.
            throw new Error('Session expired. Please log in again.');
        }

        if (response.status === 204) {
            return;
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP Error: ${response.status}`);
        }

        return data;
    } catch (error) {
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

export const getRequestStatuses = () => apiRequest('/request-statuses');
