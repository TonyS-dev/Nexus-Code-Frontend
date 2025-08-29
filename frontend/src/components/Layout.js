/**
 * @file Layout.js
 * @description Creates the main application layout, including the sidebar and main content area.
 * This component acts as the primary container for all authenticated views.
 */
import { Sidebar } from './Sidebar.js';
import { Navbar } from './Navbar.js';

export function AppLayout() {
    const layoutContainer = document.createElement('div');
    layoutContainer.className = 'app-container';

    const sidebarContainer = document.createElement('aside');
    sidebarContainer.id = 'sidebar-container';

    const mainPanel = document.createElement('div');
    mainPanel.className = 'main-panel';

    const navbarContainer = document.createElement('header');
    navbarContainer.id = 'navbar-container';

    const contentArea = document.createElement('main');
    contentArea.id = 'app-content'; // Router injects page content here.

    // Assemble the layout structure.
    mainPanel.append(navbarContainer, contentArea);
    layoutContainer.append(sidebarContainer, mainPanel);

    // Populate containers with their respective components.
    sidebarContainer.append(Sidebar());

    const navbarComponent = Navbar();
    navbarContainer.append(navbarComponent);

    /**
     * Exposes a method on the layout element to dynamically set the navbar title.
     * @param {string} title - The new title to display in the navbar.
     */
    layoutContainer.setTitle = (title) => {
        navbarComponent.setTitle(title);
    };

    return layoutContainer;
}
