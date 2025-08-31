/**
 * export function NotificationBell() {
    const bellContainer = document.createElement('div');
    bellContainer.className = 'relative';
    bellContainer.style.overflow = 'visible';
    
    bellContainer.innerHTML = `
        <button type="button" id="notification-bell" class="relative p-2 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-background-secondary" style="overflow: visible;">
            <i class="fa-solid fa-bell text-lg"></i>
        </button>
        <span id="notification-badge" class="absolute bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center font-semibold px-1 z-50 border-2 border-white shadow-md" style="display: none; top: -2px; right: -2px; min-width: 20px; height: 20px;"></span>`;ificationBell.js  
 * @description Notification bell component for the header
 */
import { notify } from '../services/notification.service.js';
import * as api from '../services/api.service.js';

export function NotificationBell() {
    const bellContainer = document.createElement('div');
    bellContainer.className = 'relative';
    
    bellContainer.innerHTML = `
        <button type="button" id="notification-bell" class="relative p-2 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-background-secondary">
            <i class="fa-solid fa-bell text-lg"></i>
            <span id="notification-badge" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold" style="display: none;"></span>
        </button>
        
        <!-- Notification Dropdown -->
        <div id="notification-dropdown" class="absolute right-0 top-full mt-2 w-80 bg-background-primary border border-border-color rounded-lg shadow-special z-40 hidden">
            <div class="p-4 border-b border-border-color">
                <h3 class="font-semibold text-text-primary">Notifications</h3>
                <button id="mark-all-read" class="text-sm text-primary-color hover:text-primary-color/80 float-right">Mark all as read</button>
                <div class="clear-both"></div>
            </div>
            <div id="notification-list" class="max-h-96 overflow-y-auto w-full">
                <div class="p-8 text-center text-text-secondary">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-color mx-auto mb-3"></div>
                    <p>Loading notifications...</p>
                </div>
            </div>
        </div>
    `;

    let notifications = [];

    // Load notifications from API
    async function loadNotifications() {
        try {
            const response = await api.getUserNotifications();
            notifications = response.data || [];
            updateBadge();
            renderNotifications();
        } catch (error) {
            console.error('Error loading notifications:', error);
            const listContainer = bellContainer.querySelector('#notification-list');
            listContainer.innerHTML = `
                <div class="p-8 text-center text-text-secondary">
                    <i class="fa-solid fa-exclamation-triangle text-3xl mb-3 text-red-500"></i>
                    <p>Failed to load notifications</p>
                </div>
            `;
        }
    }

    function updateBadge() {
        const unreadCount = notifications.filter(n => !n.is_read).length;
        const badge = bellContainer.querySelector('#notification-badge');
        
        if (unreadCount > 0) {
            badge.textContent = unreadCount > 99 ? '99+' : unreadCount.toString();
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }

    function formatTimestamp(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    }

    function getNotificationIcon(message) {
        // Determine icon based on message content
        if (message.toLowerCase().includes('approved')) return 'fa-check-circle text-green-500';
        if (message.toLowerCase().includes('rejected')) return 'fa-times-circle text-red-500';
        if (message.toLowerCase().includes('review')) return 'fa-clock text-yellow-500';
        if (message.toLowerCase().includes('submitted')) return 'fa-paper-plane text-blue-500';
        return 'fa-info-circle text-blue-500';
    }

    function renderNotifications() {
        const listContainer = bellContainer.querySelector('#notification-list');
        
        if (notifications.length === 0) {
            listContainer.innerHTML = `
                <div class="p-8 text-center text-text-secondary">
                    <i class="fa-solid fa-bell-slash text-3xl mb-3 opacity-50"></i>
                    <p>No notifications yet</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = notifications.map(notification => `
            <div class="notification-item w-full p-4 border-b border-border-color hover:bg-background-secondary transition-colors cursor-pointer ${!notification.is_read ? 'bg-blue-50/50' : ''}" 
                 data-id="${notification.id}" 
                 data-url="${notification.related_url || ''}">
                <div class="flex items-start gap-3 w-full">
                    <div class="flex-shrink-0 mt-1">
                        <i class="fa-solid ${getNotificationIcon(notification.message)}"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm ${!notification.is_read ? 'font-semibold' : ''} text-text-primary break-words">${notification.message}</p>
                        <p class="text-xs text-text-secondary mt-1">${formatTimestamp(notification.sent_date)}</p>
                    </div>
                    ${!notification.is_read ? '<div class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>' : ''}
                </div>
            </div>
        `).join('');
    }

    // Event listeners
    const bell = bellContainer.querySelector('#notification-bell');
    const dropdown = bellContainer.querySelector('#notification-dropdown');
    
    bell.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = dropdown.classList.contains('hidden');
        
        if (isHidden) {
            dropdown.classList.remove('hidden');
            if (notifications.length === 0) {
                loadNotifications();
            }
        } else {
            dropdown.classList.add('hidden');
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        // Only close if click is outside the entire bell container
        if (!bellContainer.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });

    // Prevent dropdown from closing when clicking inside it
    dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Mark individual notification as read
    bellContainer.addEventListener('click', async (e) => {
        const notificationItem = e.target.closest('.notification-item');
        if (notificationItem) {
            const id = notificationItem.dataset.id;
            const url = notificationItem.dataset.url;
            const notification = notifications.find(n => n.id === id);
            
            if (notification && !notification.is_read) {
                try {
                    await api.markNotificationAsRead(id);
                    notification.is_read = true;
                    updateBadge();
                    renderNotifications();
                    notify.success('Notification marked as read');
                } catch (error) {
                    notify.error('Failed to mark notification as read');
                }
            }
            
            // Navigate to related URL if available - WIP
            if (url && url !== '/approvals/pending') {
                router.navigate(url);
            }
        }
    });

    // Mark all as read
    bellContainer.querySelector('#mark-all-read').addEventListener('click', async () => {
        try {
            await api.markAllNotificationsAsRead();
            notifications.forEach(n => n.is_read = true);
            updateBadge();
            renderNotifications();
            notify.success('All notifications marked as read');
        } catch (error) {
            notify.error('Failed to mark all notifications as read');
        }
    });

    // Initial load of unread count (lightweight)
    async function loadUnreadCount() {
        try {
            const response = await api.getUnreadNotificationCount();
            const unreadCount = response.data.unread_count;
            const badge = bellContainer.querySelector('#notification-badge');
            
            if (unreadCount > 0) {
                badge.textContent = unreadCount > 99 ? '99+' : unreadCount.toString();
                badge.style.display = 'flex';
            }
        } catch (error) {
            console.error('❌ Error loading unread count:', error);
        }
    }

    // Load unread count immediately
    loadUnreadCount();

    return bellContainer;
}