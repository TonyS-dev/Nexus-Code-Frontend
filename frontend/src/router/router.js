/**
 * @file router.js
 * @description Configures the client-side router using Navigo.
 * Handles route definitions, protection, and rendering of page components within the main layout.
 */
import Navigo from 'navigo';
import { auth } from '../services/auth.service.js';
import { AppLayout } from '../components/Layout.js';
import { initializeTheme } from '../services/theme.service.js'; 

// Import all page components
import { showLoginPage } from '../pages/Login.js';
import { showDashboardPage } from '../pages/Dashboard.js';
import { showMyRequestsPage } from '../pages/MyRequests.js';
import { showNewRequestPage } from '../pages/NewRequest.js';
import { showManagerRequestsPage } from '../pages/ManagerRequests.js';
import { renderNotFoundPage } from '../pages/NotFound.js';
import { renderForbiddenPage } from '../pages/Forbidden.js';

const appContainer = document.getElementById('app');
export const router = new Navigo('/');

/**
 * Renders a page component within the main application layout.
 * It handles authenticated access and role-based authorization before rendering.
 * @param {Function} pageComponent - The function that creates the page's DOM element.
 * @param {Object} [options={}] - Configuration for the route.
 * @param {string} [options.title] - The title for the navbar.
 * @param {string[]} [options.roles] - An array of roles allowed to access this page.
 */
function renderPage(pageComponent, options = {}) {
    if (!auth.isAuthenticated()) {
        router.navigate('/login');
        return;
    }

    const user = auth.getUser();
    if (options.roles && !options.roles.includes(user?.role)) {
        renderForbiddenPage();
        return;
    }

    appContainer.innerHTML = '';
    const layout = AppLayout();
    const match = router.lastResolved()?.params;

    // The page component is now responsible for handling its own data fetching.
    const pageElement = pageComponent(match?.data); // Pass route params if any

    layout.querySelector('#app-content').append(pageElement);
    layout.setTitle(options.title || 'Dashboard');
    appContainer.append(layout);

    // After rendering, ensure Navigo scans for new links.
    initializeTheme();
    router.updatePageLinks();
}

/**
 * Initializes and configures all application routes.
 */
export function setupRouter() {
    const routes = {
        '/': () => {
            // Redirect based on authentication status.
            auth.isAuthenticated() ? router.navigate('/dashboard') : router.navigate('/login');
        },
        '/login': () => {
            if (auth.isAuthenticated()) {
                router.navigate('/dashboard');
                return;
            }
            appContainer.innerHTML = '';
            appContainer.append(showLoginPage());
            initializeTheme();
        },
        '/dashboard': () => renderPage(showDashboardPage, { title: 'Dashboard' }),
        '/my-requests': () => renderPage(showMyRequestsPage, { title: 'My Requests' }),
        '/requests/new': () => renderPage(showNewRequestPage, { title: 'New Request' }),
        
        // Role-protected routes
        '/manager-requests': () => renderPage(showManagerRequestsPage, {
            title: 'Approve Requests',
            roles: ['Manager', 'Admin', 'HR'], // Example: multiple roles can access
        }),
        
        '/forbidden': () => {
            appContainer.innerHTML = '';
            appContainer.append(renderForbiddenPage());
        },
    };

    router.on(routes).resolve();

    router.notFound(() => {
        appContainer.innerHTML = '';
        appContainer.append(renderNotFoundPage());
    });
}