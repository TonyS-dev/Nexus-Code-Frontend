/**
 * @file Navbar.js
 * @description Creates the top navigation bar component with title, notifications, and logout.
 */
import { auth } from '../services/auth.service.js';
import { router } from '../router/router.js';
import { NotificationBell } from './NotificationBell.js';

export function Navbar(toggleSidebar) {
    const navbarElement = document.createElement('nav');
    navbarElement.className =
        'flex-shrink-0 w-full h-16 bg-background-primary flex items-center justify-between px-4 md:px-6 border-b border-border-color';

    navbarElement.innerHTML = `
        <div class="flex items-center gap-4">
            <button id="sidebar-toggle" class="lg:hidden text-text-secondary hover:text-text-primary">
                <i class="fa-solid fa-bars text-xl"></i>
            </button>
            <h1 id="view-title" class="text-lg font-semibold text-text-primary hidden sm:block">Dashboard</h1>
        </div>
        <div class="flex items-center gap-4">
            <div id="notification-container"></div>
            <button id="navbar-logout-btn" class="flex items-center gap-2 p-2 rounded-lg text-text-secondary hover:bg-background-secondary hover:text-text-primary transition-colors">
                <i class="fa-solid fa-sign-out-alt"></i>
                <span class="hidden md:inline">Log out</span>
            </button>
        </div>
    `;

    navbarElement
        .querySelector('#sidebar-toggle')
        .addEventListener('click', toggleSidebar);

    const notificationContainer = navbarElement.querySelector(
        '#notification-container'
    );
    notificationContainer.appendChild(NotificationBell());

    navbarElement
        .querySelector('#navbar-logout-btn')
        .addEventListener('click', () => {
            auth.logout();
            router.navigate('/login');
        });

    navbarElement.setTitle = (title) => {
        const titleElement = navbarElement.querySelector('#view-title');
        if (titleElement) {
            titleElement.textContent = title;
        }
    };

    return navbarElement;
}
