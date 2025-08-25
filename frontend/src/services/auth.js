// frontend/src/services/auth.js
import { apiRequest } from './api.js';

export const auth = {
    /**
     * Authenticates a user by sending credentials to the backend.
     * On success, it stores the received token and user data.
     * @param {string} email - The user's email.
     * @param {string} password - The user's plain text password.
     */
    login: async (email, password) => {
        try {
            // Call the login endpoint of the backend
            const response = await apiRequest('/auth/login', 'POST', {
                email,
                password,
            });

            // The backend responds with the token and the user
            if (response.token && response.user) {
                localStorage.setItem('token', response.token); // Store the token
                localStorage.setItem('user', JSON.stringify(response.user)); // Store the user
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            // The backend should have sent a clear error message
            throw new Error(error.message || 'Invalid credentials');
        }
    },

    /**
     * Logs the user out by clearing their authentication state from localStorage.
     * It does NOT handle navigation.
     */
    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    },

    /**
     * Checks if a user is currently authenticated.
     * @returns {boolean} True if a token exists, false otherwise.
     */
    isAuthenticated: () => {
        // Authenticated if there's a token in localStorage
        return !!localStorage.getItem('token');
    },

    /**
     * Retrieves the stored user object.
     * @returns {Object|null} The user object or null if not found.
     */
    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
};
