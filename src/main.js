// frontend/src/main.js
import './assets/css/main.css';
import './assets/css/login.css';
import './assets/css/forms.css';
import './assets/css/animations.css';
import './assets/css/global-animations.css';

import { setupRouter } from './router/router.js';
import { initializeTheme } from './services/theme.service.js';

function checkNotifications() {
  setInterval(async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    try {
      const response = await fetch('/notifications/unread', {
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
  }, 300000); 
}

document.addEventListener('DOMContentLoaded', () => {
    // Ensure the app container is ready for a full-height layout
    const appElement = document.getElementById('app');
    if (appElement) {
        appElement.classList.add('h-screen', 'w-screen');
    }

    initializeTheme();
    setupRouter();
    checkNotifications();
});