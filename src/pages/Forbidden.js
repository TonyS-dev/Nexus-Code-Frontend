// frontend/src/pages/Forbidden.js
import { auth } from '../services/auth.service.js';
import { router } from '../router/router.js';

export function renderForbiddenPage() {
    const container = document.createElement('div');
    container.className = 'status-page-container';
    const targetRoute = auth.isAuthenticated() ? '/dashboard' : '/login';

    container.innerHTML = `
        <div class="status-content">
            <i class="fa-solid fa-lock status-icon"></i>
            <h2>403 - Access Denied</h2>
            <p>You do not have the required permissions to view this page.</p>
            <button id="back-btn" class="btn-primary">Go to Home</button>
        </div>
    `;
    container
        .querySelector('#back-btn')
        .addEventListener('click', () => router.navigate(targetRoute));
    return container;
}
