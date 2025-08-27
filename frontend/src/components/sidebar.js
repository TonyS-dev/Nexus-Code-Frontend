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

    // Define menu items based on the 'role_name' from the API
    const menuItems = {
        Employee: [
            { href: '/dashboard', icon: 'house', label: 'Dashboard' },
            { href: '/my-requests', icon: 'file-alt', label: 'My Requests' },
            { href: '/requests/new', icon: 'plus-circle', label: 'New Request' },
            { href: '/employee/history', icon: 'history', label: 'My History' },
        ],
        Manager: [
            { href: '/dashboard', icon: 'house', label: 'Dashboard' },
            { href: '/my-requests', icon: 'file-alt', label: 'My Requests' },
            { href: '/manager-requests', icon: 'check-circle', label: 'Approve Requests' },
        ],
        Admin: [
            { href: '/dashboard', icon: 'house', label: 'Dashboard' },
            { href: '/manage-users', icon: 'users-cog', label: 'Manage Users' },
            { href: '/admin-requests', icon: 'tachometer-alt', label: 'HR Dashboard' },
        ],
        // !TODO: Add hr Role if necessary
    };
    
    // Default to 'Employee' menu if role is not recognized
    const userMenu = menuItems[user.role_name] || menuItems.Employee;

    const menuList = document.createElement('ul');
    userMenu.forEach(item => {
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
    `;
    sidebarElement.querySelector('.sidebar-menu').appendChild(menuList);

    /**
     * Exposes a method to update the active link based on the current route.
     * @param {string} path - The current route path (e.g., '/dashboard').
     */
    sidebarElement.updateActiveLink = (path) => {
        sidebarElement.querySelectorAll('a[data-navigo]').forEach(link => {
            const linkPath = link.getAttribute('href');
            const parentLi = link.parentElement;
            // Add 'active' class if the path matches exactly or is a sub-route
            if (path === linkPath || (linkPath !== '/' && path.startsWith(linkPath))) {
                parentLi.classList.add('active');
            } else {
                parentLi.classList.remove('active');
            }
        });
    };

    router.updatePageLinks(); // Tell Navigo to scan for new data-navigo links

    return sidebarElement;
}