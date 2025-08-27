// src/services/auth.js

const MOCK_USER = {
  id: 'mock-001',
  first_name: 'Roberto',
  last_name: 'Gómez',
  email: 'roberto@empresa.com',
  role: 'employee',
  role_name: 'Empleado'
};

// Cambia a true solo para pruebas sin login
const USE_MOCK = false;

export const auth = {
  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = this.getUser();
    
    if (USE_MOCK) return true;
    return !!(token && user);
  },

  /**
   * Obtiene el usuario actual
   * @returns {Object|null}
   */
  getUser() {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing user from localStorage', e);
        return null;
      }
    }

    if (USE_MOCK) {
      return MOCK_USER;
    }
    return null;
  },

  /**
   * Inicia sesión y guarda usuario y token
   * @param {Object} userData
   */
  login(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', 'mock-token-123'); // Simula un JWT
  },

  /**
   * Cierra sesión y limpia datos
   */
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
};