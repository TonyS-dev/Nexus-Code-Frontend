// frontend/src/services/auth.js
import { apiRequest } from './api.js';

export const auth = {
    login: async (email, password) => {
        try {
            // We call the login endpoint of the backend
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
    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        location.hash = '#/login';
        // Important: reload the page to clear the state
        location.reload();
    },
    isAuthenticated: () => {
        // Authenticated if there's a token in localStorage
        return !!localStorage.getItem('token');
    },
    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
};