// frontend/src/main.js
import './assets/css/main.css';
import './assets/css/dashboard.css';
import './assets/css/login.css';
import './assets/css/navbar.css';
import './assets/css/sidebar.css';
import './assets/css/vacation.css'
import './assets/css/newRequest.css';

import { setupRouter } from './router/router.js';
import { initializeTheme } from './services/theme.js';

// Función para notificaciones
function checkNotifications() {
  setInterval(async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    try {
      const response = await fetch('/api/notifications/unread', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      const bell = document.querySelector('.notification-count');
      if (bell) bell.textContent = data.count;
    } catch (e) {
      console.error('Error al cargar notificaciones', e);
    }
  }, 300000); // Cada 5 minutos
}

document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  setupRouter();        // se ejecuta esto router
  checkNotifications(); // Para luego ejecutar esta parte que son las notificaciones
});