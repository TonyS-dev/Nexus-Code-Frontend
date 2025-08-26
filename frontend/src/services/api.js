// frontend/src/services/api.js
const API_BASE_URL = import.meta.env.BACKEND_API_URL;

export async function apiRequest(path, method = 'GET', body = null) {
    const url = `${API_BASE_URL}${path}`;

    const headers = { 'Content-Type': 'application/json' };

    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers,
    };
    if (body) options.body = JSON.stringify(body);

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response
                .json()
                .catch(() => ({
                    message: `HTTP Error: ${response.statusText}`,
                }));
            throw new Error(errorData.message);
        }
        if (response.status === 204) return { success: true };
        return response.json();
    } catch (error) {
        console.error(`API request failed: ${method} ${path}`, error);
        throw error;
    }
}

// --- User API Endpoints ---
export const fetchAllUsers = () => apiRequest('/employees');
export const fetchUserById = (userId) => apiRequest(`/employees/${userId}`);
