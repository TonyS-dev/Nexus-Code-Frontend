/**
 * @file Layout.js
 * @description Creates the main application layout, including the sidebar and main content area.
 * This component acts as the primary container for all authenticated views.
 */
import { Sidebar } from './Sidebar.js';
import { Navbar } from './Navbar.js';

export function AppLayout() {
    const layoutContainer = document.createElement('div');
    layoutContainer.className =
        'flex h-screen bg-background-secondary overflow-hidden w-full';

    // Sidebar
    const sidebarComponent = Sidebar();
    sidebarComponent.id = 'sidebar-container';

    // Main content panel
    const mainPanel = document.createElement('div');
    mainPanel.className = 'flex-1 flex flex-col h-full overflow-hidden';

    // Overlay for mobile sidebar
    const overlay = document.createElement('div');
    overlay.id = 'sidebar-overlay';
    overlay.className =
        'fixed inset-0 bg-black bg-opacity-50 z-30 hidden lg:hidden';

    // Navbar
    const navbarContainer = document.createElement('header');
    navbarContainer.id = 'navbar-container';

    // Main content area
    const contentArea = document.createElement('main');
    contentArea.id = 'app-content';
    contentArea.className = 'flex-1 overflow-y-auto'; // Makes content scrollable

    const toggleSidebar = () => {
        sidebarComponent.classList.toggle('-translate-x-full');
        overlay.classList.toggle('hidden');
    };

    // Assemble the layout structure.
    const navbarComponent = Navbar(toggleSidebar);
    navbarContainer.append(navbarComponent);
    mainPanel.append(navbarContainer, contentArea);
    layoutContainer.append(sidebarComponent, mainPanel, overlay);

    overlay.addEventListener('click', toggleSidebar);

    layoutContainer.setTitle = (title) => {
        navbarComponent.setTitle(title);
    };

    return layoutContainer;
}
