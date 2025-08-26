const MOCK_USER = {

    id: 'mock-001',
    first_name: 'Roberto',
    last_name: 'Gómez',
    email: 'roberto@empresa.com',
    role: 'employee',        
    role_name: 'Empleado'    
};

const USE_MOCK = true;

export const auth = {

    isAuthenticated() {
        const hasRealUser = !!this.getUser();
        return USE_MOCK || hasRealUser;
    },

    getUser() {
        const saved = localStorage.getItem('user');
        if (saved) {

        return JSON.parse(saved);
    }

    if (USE_MOCK) {
        return MOCK_USER;
    }
    return null;
    },

    login(userData) {
        localStorage.setItem('user', JSON.stringify(userData));
    },

    logout() {

        localStorage.removeItem('user');
    }
};