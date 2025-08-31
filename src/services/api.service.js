/**
 * @file api.service.js
 * @description Centralized API request handler with automatic token expiration handling.
 */
import { auth } from './auth.service.js';

const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Centralized fetch wrapper that automatically handles 401/403 errors by logging out the user.
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
            console.warn('Authentication failed, logging out user');
            auth.logout();
            // Stop further execution and prevent components from processing an error they can't handle.
            throw new Error('Session expired. Please log in again.');
        }
        
        if (response.status === 204) {
            return; // No content to return
        }
        
        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `HTTP Error: ${response.status}`;
            
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                // If not JSON, use the text response or default message
                errorMessage = errorText || errorMessage;
            }
            
            console.error(`API Error: ${errorMessage}`);
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error in apiRequest to ${url}:`, error);
        throw error;
    }
}

// --- API Endpoint Functions ---
// Encapsulating endpoint calls into named functions improves maintainability
// and makes page components cleaner.

// Authentication
export const loginUser = (credentials) => apiRequest('/auth/login', 'POST', credentials);

// Employees
export const getEmployees = () => apiRequest('/employees');
export const getEmployeeById = (id) => {
    if (!id) {
        throw new Error('Employee ID is required');
    }
    return apiRequest(`/employees/${id}`);
};
export const createEmployee = (data) => apiRequest('/employees', 'POST', data);
export const updateEmployee = (id, data) => {
    if (!id) {
        throw new Error('Employee ID is required');
    }
    return apiRequest(`/employees/${id}`, 'PUT', data);
};
export const deleteEmployee = (id) => {
    if (!id) {
        throw new Error('Employee ID is required');
    }
    return apiRequest(`/employees/${id}`, 'PATCH');
};

// Form Population Endpoints
export const getRoles = () => apiRequest('/roles');
export const getHeadquarters = () => apiRequest('/headquarters');
export const getGenders = () => apiRequest('/genders');
export const getEmployeeStatuses = () => apiRequest('/employee-statuses');
export const getIdentificationTypes = () => apiRequest('/identification-types');
export const getAccessLevels = () => apiRequest('/access-levels');
export const getManagers = () => apiRequest('/employees?role=Manager');

// Requests and Approvals
export const getRequestsByEmployeeId = (employeeId) => apiRequest(`/requests/employee/${employeeId}`);
export const getPendingManagerRequests = () => apiRequest('/approvals/approver/pending');
export const createVacationRequest = (data) => apiRequest('/requests/vacation', 'POST', data);
export const createLeaveRequest = (data) => apiRequest('/requests/leave', 'POST', data);
export const createCertificateRequest = (data) => apiRequest('/requests/certificate', 'POST', data);
export const approveRequest = (requestId, approvalData) => apiRequest(`/requests/${requestId}/approve`, 'POST', approvalData);

// Employee Benefits
export const getVacationBalance = (employeeId) => apiRequest(`/vacation-balances/employee/${employeeId}`);

// Request Type Catalogs
export const getVacationTypes = () => apiRequest('/vacation-types');
export const getLeaveTypes = () => apiRequest('/leave-types');
export const getCertificateTypes = () => apiRequest('/certificate-types');
export const getRequestStatuses = () => apiRequest('/request-statuses');

// Notifications
export const getUserNotifications = () => apiRequest('/notifications');
export const getUnreadNotificationCount = () =>
    apiRequest('/notifications/unread-count');
export const markNotificationAsRead = (notificationId) =>
    apiRequest(`/notifications/${notificationId}/read`, 'PATCH');
export const markAllNotificationsAsRead = () =>
    apiRequest('/notifications/mark-all-read', 'PATCH');
