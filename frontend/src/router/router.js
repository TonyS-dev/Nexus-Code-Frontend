// frontend/src/router/router.js
import Navigo from 'navigo';
import { auth } from '../services/auth.js';
import { AppLayout } from '../components/layout.js';
import { renderNotFoundPage } from '../views/notFound.js'; // Make sure to import the refactored function

// Import all your page components
import { showLoginPage } from '../views/login.js';
import { showDashboardPage } from '../views/dashboard.js';
// import { showMyRequestsPage } from '../views/myRequests.js'; // You will create this file

const appContainer = document.getElementById('app');
export const router = new Navigo('/');

function renderInLayout(pageComponent) {
    appContainer.innerHTML = '';
    const layout = AppLayout();
    const pageContent = pageComponent();
    layout.querySelector('#app-content').append(pageContent);
    appContainer.append(layout);
}

export function setupRouter() {
    router.on({
        // THIS IS THE NEW, CRITICAL ROUTE
        '/': () => {
            // This is the gatekeeper route
            if (auth.isAuthenticated()) {
                router.navigate('/dashboard');
            } else {
                router.navigate('/login');
            }
        },
        '/login': () => {
            appContainer.innerHTML = '';
            appContainer.append(showLoginPage());
        },
        '/dashboard': () => renderInLayout(showDashboardPage),
        // '/my-requests': () => renderInLayout(showMyRequestsPage), // Add this back when you create the page
    });

    router.hooks({
        before: (done, match) => {
            const protectedRoutes = ['/dashboard', '/my-requests'];
            const isProtectedRoute = protectedRoutes.some((r) =>
                match.url.startsWith(r.substring(1))
            );

            if (isProtectedRoute && !auth.isAuthenticated()) {
                router.navigate('/login');
                done(false);
            } else if (match.url === 'login' && auth.isAuthenticated()) {
                router.navigate('/dashboard');
                done(false);
            } else {
                done();
            }
        },
    });

    router.notFound(() => {
        // Now this will only be called for truly non-existent routes
        appContainer.innerHTML = '';
        appContainer.append(renderNotFound()); // Assuming renderNotFound returns a DOM element
    });

    // --- Not Found Handler ---
    router.notFound(() => {
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = ''; // Clear the container
        appContainer.append(renderNotFoundPage()); // Append the new component
    });

    router.resolve();
}
