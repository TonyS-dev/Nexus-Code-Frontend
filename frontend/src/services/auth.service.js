/**
 * @file auth.service.js
 * @description Manages user session, authentication state, and interactions with localStorage.
 */
import { loginUser } from './api.service.js';

/**
 * Parses the payload of a JWT token without verifying its signature.
 * This is safe for reading claims on the client-side, as the server is the
 * single source of truth for token validity.
 * @param {string} token The JWT token string.
 * @returns {object|null} The decoded payload object or null if the token is invalid.
 */
function parseJwtPayload(token) {
    try {
        // A JWT is structured as header.payload.signature
        // We only need the payload (the middle part).
        const base64Url = token.split('.')[1];
        if (!base64Url) {
            return null;
        }

        // The payload is Base64Url encoded. We need to replace specific characters
        // to make it compatible with standard Base64 decoding.
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        // Decode the Base64 string and then parse it as JSON.
        // The decodeURIComponent handles potential UTF-8 characters.
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
}

export const auth = {
    /**
     * Authenticates the user via the API and stores session data in localStorage.
     * @param {string} email - The user's email.
     * @param {string} password - The user's password.
     * @returns {Promise<Object>} The user object from the API response.
     */
    async login(email, password) {
        const response = await loginUser({ email, password });
        if (response.token && response.user) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            return response.user;
        }
        // This case should ideally not be reached if apiRequest handles errors properly.
        throw new Error('Login failed: Invalid server response.');
    },

    /**
     * Clears user session data from localStorage, effectively logging them out.
     */
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    /**
     * Checks if a valid token exists, indicating an active session.
     * @returns {boolean} True if the user is authenticated.
     */
    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    /**
     * Retrieves the user object and enriches it with authoritative data from the JWT payload.
     * This is the definitive method for getting the current user's complete information and permissions.
     * @returns {Object|null} The combined user object (with name, email, role, accessLevel) or null.
     */
    getUser() {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');

        // If either the token or user info is missing, the session is invalid.
        if (!token || !userString) {
            return null;
        }

        const basicUserInfo = JSON.parse(userString);
        const decodedToken = parseJwtPayload(token);

        // If the token is malformed or invalid, treat the session as invalid.
        if (!decodedToken) {
            this.logout(); // Clean up a bad session
            return null;
        }

        // Combine the basic user info (for display) with the decoded token data (for permissions).
        // The token's data will overwrite any conflicting keys, ensuring it's the source of truth.
        return {
            ...basicUserInfo,
            ...decodedToken,
        };
    },

    /**
     * Retrieves the raw JWT token from storage.
     * @returns {string|null} The JWT token.
     */
    getToken() {
        return localStorage.getItem('token');
    },
};
