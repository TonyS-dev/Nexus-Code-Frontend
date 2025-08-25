// frontend/src/components/layout.js
import { Sidebar } from './sidebar.js';
import { Navbar } from './navbar.js';

export function AppLayout() {
    const appContainer = document.createElement('div');
    appContainer.className = 'app-container';

    // --- Layout Structure ---
    // This is the main frame. It calls the other components to build the UI.
    appContainer.innerHTML = `
        <div class="main-panel">
            <div id="navbar-container"></div>
            <main id="app-content" class="page-content">
                <!-- The router will insert page content here -->
            </main>
        </div>
    `;

    // Create and append the Sidebar
    appContainer.prepend(Sidebar());

    // Create and append the Navbar into its placeholder
    const navbarContainer = appContainer.querySelector('#navbar-container');
    navbarContainer.append(Navbar());

    return appContainer;
}
