/**
 * @file router.js
 * @description Configures the client-side router using Navigo.
 */
import Navigo from 'navigo';
import { auth } from '../services/auth.service.js';
import { AppLayout } from '../components/Layout.js';
import { initializeTheme } from '../services/theme.service.js';
import { getUserAccessLevel } from '../utils/helpers.js';

// Import all page components
import { showLoginPage } from '../pages/Login.js';
import { showDashboardPage } from '../pages/Dashboard.js';
import { showMyRequestsPage } from '../pages/MyRequests.js';
import { showNewRequestPage } from '../pages/NewRequest.js';
import { showManagerRequestsPage } from '../pages/ManagerRequests.js';
import { renderNotFoundPage } from '../pages/NotFound.js';
import { renderForbiddenPage } from '../pages/Forbidden.js';
import { showManageUsersPage } from '../pages/manageUsers.js';
import { showNewEmployeePage } from '../pages/newEmployee.js';
import { showEditEmployeePage } from '../pages/editEmployee.js';

const appContainer = document.getElementById('app');
export const router = new Navigo('/');

/**
 * Renders a page component within the main layout.
 * @param {Function} pageComponent - The function that creates the page's DOM element.
 * @param {Object} [options={}] - Route configuration options.
 * @param {Object} [params={}] - Parameters extracted from the URL.
 */
async function renderPage(pageComponent, options = {}, params = {}) {
    appContainer.innerHTML = '';
    
    if (!auth.isAuthenticated()) {
        router.navigate('/login');
        return;
    }

    const user = auth.getUser();
    
    // Check access level instead of role for app permissions
    if (options.accessLevels) {
        const userAccessLevel = getUserAccessLevel(user);
        if (!options.accessLevels.some(level => level.toLowerCase() === userAccessLevel.toLowerCase())) {
            appContainer.append(renderForbiddenPage());
            return;
        }
    }

    try {
        const layout = AppLayout();
        
        // Page function now receives parameters directly
        const pageElement = await pageComponent(params);
        
        const appContent = layout.querySelector('#app-content');
        appContent.innerHTML = '';
        appContent.append(pageElement);
        
        layout.setTitle(options.title || 'Dashboard');
        appContainer.append(layout);
        
        initializeTheme();
        router.updatePageLinks();
    } catch (error) {
        appContainer.innerHTML = `<div class="alert error"><h3>Error Loading Page</h3><p>${error.message}</p></div>`;
    }
}

export function setupRouter() {
    const routes = {
        '/': () => {
            // Redirect based on authentication status.
            auth.isAuthenticated()
                ? router.navigate('/dashboard')
                : router.navigate('/login');
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
        '/dashboard': () => {
            const user = auth.getUser();
            const title = user?.first_name
                ? `Welcome, ${user.first_name}!`
                : 'Dashboard';
            renderPage(showDashboardPage, { title });
        },
        '/my-requests': () =>
            renderPage(showMyRequestsPage, { title: 'My Requests' }),
        '/requests/new': () =>
            renderPage(showNewRequestPage, { title: 'New Request' }),
        '/manager-requests': () =>
            renderPage(showManagerRequestsPage, {
                title: 'Approve Requests',
                accessLevels: ['Admin'], // Only Admin access level can approve requests
            }),

        // Access level protected routes (Admin only)
        '/manage-users': () =>
            renderPage(showManageUsersPage, {
                title: 'Manage Users',
                accessLevels: ['Admin'],
            }),
        '/edit-employee/:id': (match) => {
            renderPage(showEditEmployeePage, {
                    title: 'Edit Employee',
                    accessLevels: ['Admin'],
                },
                match.data
            ); // Pass 'match.data' as the third 'params' argument.
        },

        '/new-employee': () =>
            renderPage(showNewEmployeePage, {
                title: 'New Employee',
                accessLevels: ['Admin'],
            }),

        '/forbidden': () => {
            appContainer.innerHTML = '';
            appContainer.append(renderForbiddenPage());
        },
    };

    // Handle 404 - not found routes
    router.on(routes);
    
    router.notFound(() => {
        appContainer.innerHTML = '';
        appContainer.append(renderNotFoundPage());
    });

    // Start the router
    router.resolve();
}