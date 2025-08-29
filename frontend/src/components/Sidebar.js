/**
 * @file Sidebar.js
 * @description Creates the sidebar navigation component.
 * Links are dynamically rendered based on the user's access level, which is
 * read directly from the decoded JWT payload for security and accuracy.
 */
import { auth } from '../services/auth.service.js';
import { router } from '../router/router.js';

export function Sidebar() {
    // Get the complete user object, now including JWT data like 'accessLevel'.
    const user = auth.getUser();
    if (!user) return document.createElement('div'); // Failsafe

    const sidebarElement = document.createElement('div');
    sidebarElement.className = 'sidebar';

    // Base menu for every authenticated user.
    let menuItems = [
        { href: '/dashboard', icon: 'fa-house', label: 'Dashboard' },
        { href: '/my-requests', icon: 'fa-file-alt', label: 'My Requests' },
        { href: '/requests/new', icon: 'fa-plus-circle', label: 'New Request' },
    ];

    if (user.accessLevel === 'Admin') {
        menuItems.push(
            {
                href: '/manager-requests',
                icon: 'fa-check-circle',
                label: 'Approve Requests',
            },
            {
                href: '/manage-users',
                icon: 'fa-users-cog',
                label: 'Manage Users',
            }
            // Add any other Admin-specific links here
        );
    }
    // Example for a different access level, like a manager who is not a full admin.
    else if (user.accessLevel === 'Manager' || user.accessLevel === 'HR') {
        menuItems.push({
            href: '/manager-requests',
            icon: 'fa-check-circle',
            label: 'Approve Requests',
        });
    }
    // This structure is now easily extendable for other roles.

    const menuList = menuItems
        .map(
            (item) => `
        <li>
            <a href="${item.href}" data-navigo>
                <i class="fa-solid ${item.icon}"></i>
                <span>${item.label}</span>
            </a>
        </li>
    `
        )
        .join('');

    sidebarElement.innerHTML = `
        <div class="sidebar-header">
            <img src="https://i.pravatar.cc/60?u=${
                user.email
            }" alt="User Avatar">
            <h3>${user.first_name} ${user.last_name}</h3>
            <p>${
                user.role || 'Employee'
            }</p> <!-- Display the authoritative access level -->
        </div>
        <nav class="sidebar-menu">
            <ul>
                ${menuList}
            </ul>
        </nav>
    `;

    // Highlight active link logic...
    const currentPath = router.lastResolved()?.url || '';
    sidebarElement.querySelectorAll('a').forEach((link) => {
        if (link.getAttribute('href') === `/${currentPath}`) {
            link.parentElement.classList.add('active');
        }
    });

    return sidebarElement;
}
