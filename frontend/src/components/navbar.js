// frontend/src/components/navbar.js
import { auth } from '../services/auth.js';
import { router } from '../router/router.js';

/**
 * Creates the top navigation bar component.
 */
export function Navbar() {
    const navbarElement = document.createElement('header');
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
            <button id="navbar-logout-btn" class="btn-logout">Log out</button>
        </div>
    `;

    navbarElement.querySelector('#navbar-logout-btn').addEventListener('click', () => {
        auth.logout();
        router.navigate('/login');
    });

    /**
     * Exposes a method to update the navbar's title.
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