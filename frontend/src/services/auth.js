import { loginUser } from './api.js';

export const auth = {
    /**
     * Authenticates the user via the API and stores session data.
     * @param {string} email
     * @param {string} password
     * @returns {Promise<Object>} The user object returned from the API.
     */
    async login(email, password) {
        const response = await loginUser({ email, password });
        if (response.token && response.user) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            return response.user;
        }
        throw new Error('Login failed: Invalid server response.');
    },

    /**
     * Clears session data from localStorage.
     */
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    /**
     * Checks if a valid token exists in storage.
     * @returns {boolean}
     */
    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    /**
     * Retrieves the parsed user object from storage.
     * @returns {Object|null}
     */
    getUser() {
        const userString = localStorage.getItem('user');
        if (!userString) return null;
        try {
            return JSON.parse(userString);
        } catch (error) {
            console.error('Auth Service: Failed to parse user data.', error);
            this.logout();
            return null;
        }
    },

    /**
     * Retrieves the raw JWT token from storage.
     * @returns {string|null}
     */
    getToken() {
        return localStorage.getItem('token');
    },
};
