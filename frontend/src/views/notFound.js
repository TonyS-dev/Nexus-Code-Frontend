// frontend/src/views/notFound.js

import { auth } from '../services/auth.js';
import { router } from '../router/router.js';

/**
 * Creates and returns a DOM element for the 404 "Page Not Found" view.
 * The "Go Back" button intelligently points to the Dashboard or Login page
 * based on the user's authentication status.
 */
export function renderNotFoundPage() {
    // Create the main container for the component.
    const container = document.createElement('div');
    container.className = 'status-page-container';

    // Determine button text and navigation target based on auth state.
    const isAuthenticated = auth.isAuthenticated();
    const buttonText = isAuthenticated ? 'Back to Dashboard' : 'Back to Login';
    const targetRoute = isAuthenticated ? '/dashboard' : '/login';

    // Set the inner HTML of the self-contained component.
    container.innerHTML = `
        <div class="status-content">
            <i class="fa-solid fa-compass status-icon"></i>
            <h2>404 - Page Not Found</h2>
            <p>Sorry, the page you are looking for does not exist.</p>
            <button id="status-back-btn" class="btn-primary">${buttonText}</button>
        </div>
    `;

    // Attach the event listener to the button WITHIN the container.
    const backButton = container.querySelector('#status-back-btn');
    backButton.addEventListener('click', () => {
        // Use the router for navigation
        router.navigate(targetRoute);
    });

    // Return the complete, functional DOM element.
    return container;
}
