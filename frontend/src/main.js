// frontend/src/main.js (Final Version)
import { setupRouter } from './router/router.js';
import { initializeTheme } from './services/theme.js';

// When the DOM is fully loaded, initialize the router.
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    setupRouter();
});
