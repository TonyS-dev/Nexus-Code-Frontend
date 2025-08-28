// frontend/src/router/router.js
import Navigo from 'navigo';
import { auth } from '../services/auth.js';
import { AppLayout } from '../components/layout.js';

// Imports of all the views 
import { showLoginPage } from '../views/login.js';
import { showDashboardPage } from '../views/dashboard.js';
import { showMyRequestsPage } from '../views/myRequests.js';
import { showNewRequestPage } from '../views/newRequest.js';
import { showManageUsersPage } from '../views/manageUsers.js';
import { showAdminRequestsPage } from '../views/adminRequests.js';
import { showManagerRequestsPage } from '../views/managerRequests.js';
import { showEmployeeHistoryPage } from '../views/employeeHistory.js';
import { renderNotFoundPage } from '../views/notFound.js';
import { renderForbiddenPage } from '../views/forbidden.js';

const appContainer = document.getElementById('app');
export const router = new Navigo('/');

/**
 * Renders a page component within the main application layout.
 * It handles authenticated access and authorization before rendering.
 * @param {Function} pageComponent - The function that creates the page's DOM element.
 * @param {Object} [options={}] - Configuration for the route.
 * @param {string} [options.title] - The title for the navbar.
 * @param {string} [options.role] - An optional role required to access this page.
 */
function renderPage(pageComponent, options = {}) {
    if (!auth.isAuthenticated()) {
        router.navigate('/login');
        return;
    }

    const user = auth.getUser();
    if (options.role && user?.role !== options.role) {
        router.navigate('/forbidden');
        return;
    }

    appContainer.innerHTML = '';
    const layout = AppLayout();

    const match = router.lastResolved()?.[0];
    const page = pageComponent(match?.params); // Pass the params object to the page

    layout.querySelector('#app-content').append(page);
    layout.setTitle(options.title || 'Dashboard');
    appContainer.append(layout);
}

export function setupRouter() {
    const routes = {
        '/': () => {
            if (auth.isAuthenticated()) router.navigate('/dashboard');
            else router.navigate('/login');
        },
        '/login': () => {
            if (auth.isAuthenticated()) {
                router.navigate('/dashboard');
                return;
            }
            appContainer.innerHTML = '';
            appContainer.append(showLoginPage());
        },
        '/dashboard': () =>
            renderPage(showDashboardPage, { title: 'Dashboard' }),
        '/my-requests': () =>
            renderPage(showMyRequestsPage, { title: 'My Requests' }),
        '/requests/new': () =>
            renderPage(showNewRequestPage, { title: 'New Request' }),

        // Routes protected by role
        '/manage-users': () =>
            renderPage(showManageUsersPage, {
                title: 'Manage Users',
                role: 'Admin',
            }),
        '/admin-requests': () =>
            renderPage(showAdminRequestsPage, {
                title: 'HR Dashboard',
                role: 'HR',
            }),
        '/manager-requests': () =>
            renderPage(showManagerRequestsPage, {
                title: 'Approve Requests',
                role: 'Manager',
            }),

        // Dynamic route 
        '/employee/:id/history': (match) =>
            renderPage(showEmployeeHistoryPage, {
                title: 'Employee History',
                params: match.data,
            }),

        '/forbidden': () => {
            appContainer.innerHTML = '';
            appContainer.append(renderForbiddenPage());
        },
    };

    router.on(routes);

    router.hooks({
        after: (match) => {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar && sidebar.updateActiveLink) {
                sidebar.updateActiveLink(`/${match.url}`);
            }
        },
    });

    router.notFound(() => {
        renderPage(renderNotFoundPage, { title: 'Not Found' });
    });

    router.resolve();
}
