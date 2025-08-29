// frontend/src/components/sidebar.js
import { auth } from '../services/auth.js';
import { router } from '../router/router.js';

/**
 * Creates the sidebar navigation component.
 * Links are dynamically generated based on the authenticated user's role.
 */
export function Sidebar() {
    const user = auth.getUser();
    if (!user) return document.createElement('aside'); // Return empty element if no user

    const sidebarElement = document.createElement('aside');
    sidebarElement.className = 'sidebar';

    // --- Menu Definition ---
    // Start with a base menu for all employees
    let menuItems = [
        { href: '/dashboard', icon: 'house', label: 'Dashboard' },
        { href: '/my-requests', icon: 'file-alt', label: 'My Requests' },
        { href: '/requests/new', icon: 'plus-circle', label: 'New Request' },
        // Let's use the user's ID for a dynamic history route
        {
            href: `/employee/${user.id}/history`,
            icon: 'history',
            label: 'My History',
        },
    ];

    // Add manager-specific links if the user is a Manager or Admin
    if (
        user.role_name === 'Manager' ||
        user.role_name === 'Admin' ||
        user.role_name === 'HR'
    ) {
        menuItems.push({
            href: '/manager-requests',
            icon: 'check-circle',
            label: 'Approve Requests',
        });
    }

    // Add HR/Admin-specific links
    if (user.role_name === 'Admin' || user.role_name === 'HR') {
        menuItems.push(
            {
                href: '/admin-requests',
                icon: 'tachometer-alt',
                label: 'HR Dashboard',
            },
            { href: '/manage-users', icon: 'users-cog', label: 'Manage Users' }
        );
    }

    // Create the menu list element from the final menuItems array
    const menuList = document.createElement('ul');
    menuItems.forEach((item) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.href;
        a.setAttribute('data-navigo', ''); // Essential for Navigo to handle the link
        a.innerHTML = `<i class="fa-solid fa-${item.icon}"></i> ${item.label}`;
        li.appendChild(a);
        menuList.appendChild(li);
    });

    sidebarElement.innerHTML = `
        <div class="sidebar-header">
            <img src="https://i.pravatar.cc/60?u=${user.email}" alt="Profile">
            <h3>${user.first_name} ${user.last_name}</h3>
            <p>${user.role_name || 'Employee'}</p>
        </div>
        <div class="sidebar-menu"></div>
        <div class="sidebar-footer">
             <!-- The logout button is better placed in the Navbar for consistency -->
        </div>
    `;
    sidebarElement.querySelector('.sidebar-menu').appendChild(menuList);

    // Add event listeners to handle menu link clicks
    sidebarElement.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all li elements within this sidebar
            sidebarElement.querySelectorAll('.sidebar-menu li').forEach(li => {
                li.classList.remove('active');
            });
            
            // Add active class to the parent li of the clicked link
            this.parentElement.classList.add('active');
        });
    });

    /**
     * Exposes a method to update the active link based on the current route.
     * @param {string} currentPath - The current route path (e.g., 'dashboard').
     */
    sidebarElement.updateActiveLink = (currentPath) => {
        sidebarElement.querySelectorAll('a[data-navigo]').forEach((link) => {
            const linkPath = link.getAttribute('href');
            const parentLi = link.parentElement;

            // Remove active class from all items first
            parentLi.classList.remove('active');

            // Exact match for the dashboard/home page
            if (linkPath === '/' && currentPath === 'dashboard') {
                parentLi.classList.add('active');
                return;
            }

            // More precise matching for other links
            if (linkPath !== '/' && `/${currentPath}`.startsWith(linkPath)) {
                parentLi.classList.add('active');
            }
        });
    };

    // Tell Navigo to scan for the new data-navigo links on creation
    router.updatePageLinks();

    return sidebarElement;
}