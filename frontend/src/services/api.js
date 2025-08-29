import { auth } from './auth.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.riwi-nexus.app';

/**
 * A centralized fetch wrapper for making API requests.
 * Automatically adds the authorization header and handles common response scenarios.
 * @param {string} path - The API endpoint path (e.g., '/employees').
 * @param {string} [method='GET'] - The HTTP method for the request.
 * @param {object|null} [body=null] - The request payload for POST/PUT requests.
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

        if (response.status === 204) {
            return; // No content to parse, successful response
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP Error: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`API request failed: ${method} ${path}`, error);
        throw error;
    }
}

// --- API Endpoint Functions ---

// Index
export const getApiReadme = () => apiRequest('/');

// Auth
export const loginUser = (credentials) =>
    apiRequest('/auth/login', 'POST', credentials);
export const registerUser = (userData) =>
    apiRequest('/auth/register', 'POST', userData);

// Employees
export const getEmployees = () => apiRequest('/employees');
export const getEmployeeById = (id) => apiRequest(`/employees/${id}`);
export const createEmployee = (employeeData) =>
    apiRequest('/employees', 'POST', employeeData);
export const updateEmployee = (id, employeeData) =>
    apiRequest(`/employees/${id}`, 'PUT', employeeData);
export const deleteEmployee = (id) => apiRequest(`/employees/${id}`, 'PATCH');

// Roles
export const getRoles = () => apiRequest('/roles');
export const getRoleById = (id) => apiRequest(`/roles/${id}`);
export const createRole = (roleData) => apiRequest('/roles', 'POST', roleData);
export const updateRole = (id, roleData) =>
    apiRequest(`/roles/${id}`, 'PUT', roleData);

// Headquarters
export const getHeadquarters = () => apiRequest('/headquarters');
export const getHeadquarterById = (id) => apiRequest(`/headquarters/${id}`);
export const createHeadquarter = (hqData) =>
    apiRequest('/headquarters', 'POST', hqData);
export const updateHeadquarter = (id, hqData) =>
    apiRequest(`/headquarters/${id}`, 'PUT', hqData);

// Genders
export const getGenders = () => apiRequest('/genders');
export const getGenderById = (id) => apiRequest(`/genders/${id}`);
export const createGender = (genderData) =>
    apiRequest('/genders', 'POST', genderData);
export const updateGender = (id, genderData) =>
    apiRequest(`/genders/${id}`, 'PUT', genderData);

// Employee Statuses
export const getEmployeeStatuses = () => apiRequest('/employee-statuses');
export const getEmployeeStatusById = (id) =>
    apiRequest(`/employee-statuses/${id}`);
export const createEmployeeStatus = (statusData) =>
    apiRequest('/employee-statuses', 'POST', statusData);
export const updateEmployeeStatus = (id, statusData) =>
    apiRequest(`/employee-statuses/${id}`, 'PUT', statusData);

// Access Levels
export const getAccessLevels = () => apiRequest('/access-levels');
export const getAccessLevelById = (id) => apiRequest(`/access-levels/${id}`);
export const createAccessLevel = (levelData) =>
    apiRequest('/access-levels', 'POST', levelData);
export const updateAccessLevel = (id, levelData) =>
    apiRequest(`/access-levels/${id}`, 'PUT', levelData);

// Identification Types
export const getIdentificationTypes = () => apiRequest('/identification-types');
