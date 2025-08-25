// frontend/src/router/router.js
import Navigo from 'navigo';
import { auth } from '../services/auth.js';
import { AppLayout } from '../components/layout.js';

// Import all page components
import { showLoginPage } from '../views/login.js';
import { showDashboardPage } from '../views/dashboard.js';
import { renderNotFoundPage } from '../views/notFound.js';
import { renderForbiddenPage } from '../views/forbidden.js';
// import { showMyRequestsPage } from '../views/myRequests.js'; // !TODO: Create this file

const appContainer = document.getElementById('app');
export const router = new Navigo('/');

/**
 * A helper function to render a page component inside the main AppLayout.
 * @param {Function} pageComponent - The function that returns the page's DOM element.
 */
function renderInLayout(pageComponent) {
    appContainer.innerHTML = '';
    const layout = AppLayout();
    const pageContent = pageComponent();
    layout.querySelector('#app-content').append(pageContent);
    appContainer.append(layout);
}

/**
 * Sets up and initializes the client-side router with all routes and hooks.
 */
export function setupRouter() {
    router.on({
        '/': () => {
            // This is the gatekeeper route, redirecting based on auth status
            if (auth.isAuthenticated()) {
                router.navigate('/dashboard');
            } else {
                router.navigate('/login');
            }
        },
        '/login': () => {
            // The login page is rendered standalone, without the AppLayout
            appContainer.innerHTML = '';
            appContainer.append(showLoginPage());
        },
        '/dashboard': () => renderInLayout(showDashboardPage),
        // '/my-requests': () => renderInLayout(showMyRequestsPage), // !TODO: Create this file

        // --- Route for the access denied page ---
        '/forbidden': () => {
            appContainer.innerHTML = '';
            appContainer.append(renderForbiddenPage());
        },
    });

    // --- Route Protection Hook ---
    // This runs before every route is resolved
    router.hooks({
        before: (done, match) => {
            const protectedRoutes = ['/dashboard', '/my-requests'];
            const isProtectedRoute = protectedRoutes.some((r) =>
                match.url.startsWith(r.substring(1))
            );

            if (isProtectedRoute && !auth.isAuthenticated()) {
                // If trying to access a protected route without being logged in, redirect to login
                router.navigate('/login');
                done(false); // Stop the current navigation
            } else if (match.url === 'login' && auth.isAuthenticated()) {
                // If logged in and trying to access login, redirect to dashboard
                router.navigate('/dashboard');
                done(false);
            } else {
                // Otherwise, allow navigation to proceed
                done();
            }
        },
    });

    // --- Not Found Handler ---
    // This handler is called if no other route matches
    router.notFound(() => {
        appContainer.innerHTML = '';
        appContainer.append(renderNotFoundPage());
    });

    // Start listening for route changes
    router.resolve();
}
