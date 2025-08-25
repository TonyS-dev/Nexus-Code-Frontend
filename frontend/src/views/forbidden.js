// frontend/src/views/forbidden.js

import { auth } from '../services/auth.js';
import { router } from '../router/router.js';

/**
 * Creates and returns a DOM element for the 403 "Access Denied" view.
 * The "Go Back" button intelligently points to the Dashboard or Login page
 * based on the user's authentication status.
 */
export function renderForbiddenPage() {
    // Create the main container for this component.
    const container = document.createElement('div');
    container.className = 'status-page-container';

    // Determine the button text and navigation target based on auth state.
    const isAuthenticated = auth.isAuthenticated();
    const buttonText = isAuthenticated ? 'Back to Dashboard' : 'Back to Login';
    const targetRoute = isAuthenticated ? '/dashboard' : '/login';

    // Set the inner HTML for the self-contained component.
    container.innerHTML = `
        <div class="status-content">
            <i class="fa-solid fa-lock status-icon"></i>
            <h2>403 - Access Denied</h2>
            <p>You do not have permission to view this page.</p>
            <button id="forbidden-back-btn" class="btn-primary">${buttonText}</button>
        </div>
    `;

    // Attach the event listener to the button WITHIN this component.
    const backButton = container.querySelector('#forbidden-back-btn');
    backButton.addEventListener('click', () => {
        // Use the router for clean, centralized navigation.
        router.navigate(targetRoute);
    });

    // Return the complete, functional DOM element.
    return container;
}
