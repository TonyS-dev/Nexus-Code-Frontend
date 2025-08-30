/**
 * @file auth.service.js
 * @description Manages user session, authentication state, and interactions with localStorage.
 */
import { loginUser } from './api.service.js';
import { router } from '../router/router.js';
import { notify } from './notification.service.js';

/**
 * Parses the payload of a JWT token without verifying its signature.
 * @param {string} token The JWT token string.
 * @returns {object|null} The decoded payload object or null if the token is invalid.
 */
function parseJwtPayload(token) {
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(
                    (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                )
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Failed to parse JWT payload:', error);
        return null;
    }
}

export const auth = {
    async login(email, password) {
        const response = await loginUser({ email, password });
        if (response.token && response.user) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            notify.success('Login successful!');
            return response.user;
        }
        throw new Error('Login failed: Invalid server response.');
    },

    /**
     * Clears user session data and navigates to the login page.
     */
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        notify.info('You have been logged out');
        router.navigate('/login');
    },

    /**
     * Checks if a token exists and is not expired.
     * @returns {boolean} True if the user has a valid, non-expired token.
     */
    isAuthenticated() {
        const token = localStorage.getItem('token');
        if (!token) {
            return false;
        }

        const decoded = parseJwtPayload(token);
        if (!decoded) {
            this.logout(); // Clean up invalid token
            return false;
        }

        // The 'exp' claim in a JWT is in seconds since the epoch.
        // We compare it to the current time, also in seconds.
        const isExpired = decoded.exp < Date.now() / 1000;

        if (isExpired) {
            notify.warning('Session expired. Please log in again.');
            this.logout();
            return false;
        }

        return true;
    },

    /**
     * Retrieves the user object, combining localStorage info with authoritative data from the JWT.
     * @returns {Object|null} The user object or null if the session is invalid.
     */
    getUser() {
        if (!this.isAuthenticated()) {
            return null;
        }
        const userString = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        const basicUserInfo = JSON.parse(userString);
        const decodedToken = parseJwtPayload(token);

        // The token is the source of truth for permissions.
        return {
            ...basicUserInfo,
            ...decodedToken,
        };
    },

    getToken() {
        return localStorage.getItem('token');
    },
};
