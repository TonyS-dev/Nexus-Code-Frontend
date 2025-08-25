// frontend/src/components/Layout.js

import { auth } from '../services/auth.js';
import { router } from '../router/router.js';

export function AppLayout() {
    const user = auth.getUser();
    if (!user) {
        // This should not happen if routes are protected, but it's a good safeguard.
        return document.createElement('div');
    }

    const layoutElement = document.createElement('div');
    layoutElement.className = 'app-layout'; // A general container for the layout

    // --- Sidebar Navigation Links ---
    // Links are built based on the user's role.
    let navLinks = `
        <a href="/dashboard" class="nav-btn" data-navigo><i class="fa-solid fa-house"></i> Dashboard</a>
        <a href="/my-requests" class="nav-btn" data-navigo><i class="fa-solid fa-file-alt"></i> My Requests</a>
    `;

    // Assuming the user object has a 'role_name' property from the database
    if (user.role_name === 'Manager') {
        navLinks += `<a href="/approvals" class="nav-btn" data-navigo><i class="fa-solid fa-check-square"></i> Team Approvals</a>`;
    }
    if (user.role_name === 'HR Admin') {
        navLinks += `<a href="/manage/employees" class="nav-btn" data-navigo><i class="fa-solid fa-users-cog"></i> Manage Employees</a>`;
    }

    // --- Layout Structure ---
    layoutElement.innerHTML = `
        <aside class="sidebar">
            <div class="user-profile">
                <img src="https://i.pravatar.cc/150?u=${
                    user.email
                }" alt="User Profile" class="profile-img">
                <div class="user-info">
                    <h3>${user.first_name} ${user.last_name}</h3>
                    <p>${user.role_name || 'Employee'}</p>
                </div>
            </div>
            <nav class="sidebar-nav">${navLinks}</nav>
            <div class="sidebar-footer">
                <button id="logout-btn" class="nav-btn">
                    <i class="fa-solid fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </aside>
        <main id="app-content" class="main-content">
            <!-- The router will insert page content here -->
        </main>
    `;

    // --- Event Handling ---
    layoutElement.querySelector('#logout-btn').addEventListener('click', () => {
        auth.logout();
        router.navigate('/login'); // Ensure navigation after logout
    });

    // Let Navigo know to handle the links in this component
    router.updatePageLinks();

    return layoutElement;
}
