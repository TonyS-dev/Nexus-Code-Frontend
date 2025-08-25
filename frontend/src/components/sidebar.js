// frontend/src/components/sidebar.js
import { auth } from '../services/auth.js';
import { router } from '../router/router.js';

export function Sidebar() {
    const user = auth.getUser();
    if (!user) return document.createElement('aside'); // Return empty element if no user

    const sidebarElement = document.createElement('aside');
    sidebarElement.className = 'sidebar';

    // --- Sidebar Navigation Links ---
    let navLinks = `
        <a href="/dashboard" class="nav-btn" data-navigo><i class="fa-solid fa-house"></i> Home</a>
        <a href="/employees" class="nav-btn" data-navigo><i class="fa-solid fa-users"></i> Employees</a>
        <a href="/requests" class="nav-btn" data-navigo><i class="fa-solid fa-file-alt"></i> Requests</a>
        <a href="/settings" class="nav-btn" data-navigo><i class="fa-solid fa-cog"></i> Settings</a>
    `;

    // --- Sidebar Structure ---
    sidebarElement.innerHTML = `
        <div class="user-profile">
            <img src="https://i.pravatar.cc/150?u=${
                user.email
            }" alt="User Profile" class="profile-img">
            <div class="user-info">
                <h3>${user.first_name} ${user.last_name}</h3>
                <p>${user.role_name || 'Admin'}</p>
            </div>
        </div>
        <nav class="sidebar-nav">${navLinks}</nav>
        <div class="sidebar-footer">
            <button id="logout-btn" class="nav-btn-logout">
                Logout <i class="fa-solid fa-sign-out-alt"></i>
            </button>
        </div>
    `;

    // --- Event Handling ---
    sidebarElement
        .querySelector('#logout-btn')
        .addEventListener('click', () => {
            auth.logout();
            router.navigate('/login');
        });

    // Navigo will automatically handle the links in this component
    router.updatePageLinks();

    return sidebarElement;
}
