import './assets/css/main.css';
import './assets/css/dashboard.css';   // ← Esta línea es clave
import './assets/css/login.css';
import './assets/css/navbar.css';
import './assets/css/sidebar.css';

import { setupRouter } from './router/router.js';
import { initializeTheme } from './services/theme.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    setupRouter();
});