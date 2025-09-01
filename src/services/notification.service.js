/**
 * @file notification.service.js
 * @description Global notification system for toast messages and alerts
 */

let notificationContainer;

// Create the notification container if it doesn't exist
function ensureContainer() {
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.className = 'fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm';
        document.body.appendChild(notificationContainer);
    }
}

/**
 * Show a notification toast
 * @param {string} message - The message to display
 * @param {string} type - Type of notification: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in milliseconds (default: 5000)
 * @param {Object} options - Additional options
 */
export function showNotification(message, type = 'info', duration = 5000, options = {}) {
    ensureContainer();

    const notification = document.createElement('div');
    const id = 'notification-' + Date.now() + Math.random().toString(36).substr(2, 9);
    notification.id = id;
    
    // Base classes
    let baseClasses = 'p-4 rounded-lg shadow-lg border-l-4 flex items-start gap-3 transform transition-all duration-300 ease-in-out translate-x-full opacity-0';
    
    // Type-specific styling
    const typeStyles = {
        success: 'bg-green-50 border-green-500 text-green-900',
        error: 'bg-red-50 border-red-500 text-red-900',
        warning: 'bg-yellow-50 border-yellow-500 text-yellow-900',
        info: 'bg-blue-50 border-blue-500 text-blue-900'
    };

    const icons = {
        success: '<i class="fa-solid fa-check-circle text-green-500"></i>',
        error: '<i class="fa-solid fa-exclamation-circle text-red-500"></i>',
        warning: '<i class="fa-solid fa-exclamation-triangle text-yellow-500"></i>',
        info: '<i class="fa-solid fa-info-circle text-blue-500"></i>'
    };

    notification.className = `${baseClasses} ${typeStyles[type] || typeStyles.info}`;
    
    notification.innerHTML = `
        <div class="flex-shrink-0">
            ${icons[type] || icons.info}
        </div>
        <div class="flex-1 min-w-0">
            <p class="text-sm font-medium">${message}</p>
            ${options.description ? `<p class="text-xs opacity-75 mt-1">${options.description}</p>` : ''}
        </div>
        <button type="button" class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors" onclick="removeNotification('${id}')">
            <i class="fa-solid fa-times"></i>
        </button>
    `;

    notificationContainer.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full', 'opacity-0');
        notification.classList.add('translate-x-0', 'opacity-100');
    }, 50);

    // Auto remove
    if (duration > 0) {
        setTimeout(() => {
            removeNotification(id);
        }, duration);
    }

    return id;
}

/**
 * Remove a notification by ID
 * @param {string} id - Notification ID
 */
export function removeNotification(id) {
    const notification = document.getElementById(id);
    if (notification) {
        notification.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Make removeNotification available globally for onclick handlers
window.removeNotification = removeNotification;

/**
 * Shorthand methods for common notification types
 */
export const notify = {
    success: (message, options) => showNotification(message, 'success', 5000, options),
    error: (message, options) => showNotification(message, 'error', 7000, options),
    warning: (message, options) => showNotification(message, 'warning', 6000, options),
    info: (message, options) => showNotification(message, 'info', 900000, options),
    
    // Special methods
    loading: (message) => showNotification(message, 'info', 0, { description: 'Please wait...' }),
    apiError: (error) => {
        const message = error?.message || 'An unexpected error occurred';
        const description = error?.response?.data?.error || '';
        return showNotification(message, 'error', 8000, { description });
    }
};

/**
 * Clear all notifications
 */
export function clearAllNotifications() {
    if (notificationContainer) {
        notificationContainer.innerHTML = '';
    }
}