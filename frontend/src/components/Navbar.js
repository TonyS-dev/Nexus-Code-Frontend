/**
 * @file Navbar.js
 * @description Creates the top navigation bar component with title, notifications, and logout.
 */
import { auth } from '../services/auth.service.js';
import { router } from '../router/router.js';

export function Navbar() {
    const navbarElement = document.createElement('nav');
    navbarElement.className = 'navbar';

    navbarElement.innerHTML = `
        <div class="navbar-left">
            <h1 id="view-title">Dashboard</h1>
        </div>
        <div class="navbar-right">
            <div class="notification-bell">
                <i class="fa-solid fa-bell"></i>
                <span class="notification-count">0</span>
            </div>
            <button id="navbar-logout-btn" class="btn-logout">
                <i class="fa-solid fa-sign-out-alt"></i>
                <span>Log out</span>
            </button>
        </div>
    `;

    navbarElement
        .querySelector('#navbar-logout-btn')
        .addEventListener('click', () => {
            auth.logout();
            router.navigate('/login');
        });

    /**
     * Method to update the navbar's title dynamically.
     * @param {string} title - The new title to display.
     */
    navbarElement.setTitle = (title) => {
        const titleElement = navbarElement.querySelector('#view-title');
        if (titleElement) {
            titleElement.textContent = title;
        }
    };

    return navbarElement;
}
