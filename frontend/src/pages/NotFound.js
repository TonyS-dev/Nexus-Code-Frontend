// frontend/src/pages/NotFound.js
import { auth } from '../services/auth.service.js';
import { router } from '../router/router.js';

export function renderNotFoundPage() {
    const container = document.createElement('div');
    container.className = 'status-page-container';
    const targetRoute = auth.isAuthenticated() ? '/dashboard' : '/login';

    container.innerHTML = `
        <div class="status-content">
            <i class="fa-solid fa-compass status-icon"></i>
            <h2>404 - Page Not Found</h2>
            <p>Sorry, the page you are looking for does not exist.</p>
            <button id="back-btn" class="btn-primary">Go to Home</button>
        </div>
    `;
    container
        .querySelector('#back-btn')
        .addEventListener('click', () => router.navigate(targetRoute));
    return container;
}
