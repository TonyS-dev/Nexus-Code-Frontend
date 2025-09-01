/**
 * @file Sidebar.js
 * @description Creates the sidebar navigation component, styled with Tailwind CSS
 * to match the application's design system. Links are dynamically rendered
 * based on the user's access level from the JWT.
 */
import { auth } from '../services/auth.service.js';
import { router } from '../router/router.js';

export function Sidebar() {
    const user = auth.getUser();
    if (!user) return document.createElement('aside');

    const sidebarElement = document.createElement('aside');
    sidebarElement.className =
        'fixed inset-y-0 left-0 z-40 h-full w-64 bg-background-primary flex flex-col p-4 border-r border-border-color transform -translate-x-full transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:z-auto';

    let menuItems = [
        { href: '/dashboard', icon: 'fa-house', label: 'Dashboard' },
        { href: '/my-requests', icon: 'fa-file-lines', label: 'My Requests' },
        { href: '/requests/new', icon: 'fa-plus', label: 'New Request' },
    ];

    if (user.accessLevel === 'Admin') {
        menuItems.push(
            {
                href: '/manager-requests',
                icon: 'fa-check-to-slot',
                label: 'Approve Requests',
            },
            {
                href: '/manage-users',
                icon: 'fa-users-cog',
                label: 'Manage Users',
            }
        );
    } else if (user.accessLevel === 'Manager' || user.accessLevel === 'HR') {
        menuItems.push({
            href: '/manager-requests',
            icon: 'fa-check-to-slot',
            label: 'Approve Requests',
        });
    }

    const menuList = menuItems
        .map(
            (item) => `
        <li data-path="${item.href}">
            <a href="${item.href}" data-navigo class="nav-link flex items-center gap-3 p-3 rounded-lg text-text-secondary hover:bg-primary-light hover:text-primary transition-colors font-medium">
                <i class="fa-solid ${item.icon} w-5 text-center text-base"></i>
                <span>${item.label}</span>
            </a>
        </li>`
        )
        .join('');

    sidebarElement.innerHTML = `
        <div class="flex items-center gap-3 p-3 rounded-lg bg-primary-light mb-6">
            <img 
                src="https://api.dicebear.com/8.x/initials/svg?seed=${
                    user?.first_name || 'User'
                }"
                alt="User Avatar" class="w-10 h-10 rounded-full object-cover">
            <div>
                <h3 class="font-semibold text-sm text-text-primary">${
                    user.first_name
                } ${user.last_name}</h3>
                <p class="text-xs text-text-secondary capitalize">${
                    user.role || 'Developer'
                }</p>
            </div>
        </div>
        <nav class="flex-1">
            <ul class="space-y-2">
                ${menuList}
            </ul>
        </nav>`;

    // Function to update active link
    function updateActiveLink() {
        const currentPath = window.location.pathname;
        
        // Remove active states from all links
        const allLinks = sidebarElement.querySelectorAll('.nav-link');
        allLinks.forEach(link => {
            link.classList.remove('bg-primary-light', 'text-primary', 'font-semibold');
            link.classList.add('text-text-secondary');
        });
        
        // Add active state to current link
        const activeLink = sidebarElement.querySelector(`li[data-path='${currentPath}'] a`);
        if (activeLink) {
            activeLink.classList.add('bg-primary-light', 'text-primary', 'font-semibold');
            activeLink.classList.remove('text-text-secondary');
        }
    }

    // Set initial active state
    updateActiveLink();

    // Listen for navigation changes to update active state
    window.addEventListener('popstate', updateActiveLink);
    
    // Listen for programmatic navigation (when router.navigate() is called)
    const observer = new MutationObserver(() => {
        updateActiveLink();
    });
    
    // Store the update function on the element for external access
    sidebarElement.updateActiveLink = updateActiveLink;

    return sidebarElement;
}
