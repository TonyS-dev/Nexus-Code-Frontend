// frontend/src/components/Layout.js

import { Sidebar } from './sidebar.js';
import { Navbar } from './navbar.js';

/**
 * Creates the main application layout which includes the sidebar and the main content area.
 * This component acts as the primary container for all authenticated views.
 */
export function AppLayout() {
    const layoutContainer = document.createElement('div');
    layoutContainer.className = 'app-container';

    // Create the main structural elements
    const sidebarContainer = document.createElement('div');
    sidebarContainer.id = 'sidebar-container';

    const mainPanel = document.createElement('div');
    mainPanel.className = 'main-panel';

    const navbarContainer = document.createElement('header');
    navbarContainer.id = 'navbar-container';

    const contentArea = document.createElement('main');
    contentArea.id = 'app-content'; // This is where the router will inject pages

    // Assemble the structure
    mainPanel.append(navbarContainer, contentArea);
    layoutContainer.append(sidebarContainer, mainPanel);

    // Populate the containers with their respective components
    sidebarContainer.append(Sidebar());

    const navbarComponent = Navbar();
    navbarContainer.append(navbarComponent);

    // Expose a method on the layout itself to set the navbar title
    layoutContainer.setTitle = (title) => {
        navbarComponent.setTitle(title);
    };

    return layoutContainer;
}
