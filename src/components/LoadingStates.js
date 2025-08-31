/**
 * @file LoadingStates.js
 * @description Utility functions for managing loading states and animations
 */
import { SkeletonLoaders } from './SkeletonLoader.js';

export const LoadingStates = {
    /**
     * Shows a loading skeleton for a page
     * @param {HTMLElement} container - Container element
     * @param {string} type - Type of skeleton ('table', 'form', 'dashboard', etc.)
     */
    showPageSkeleton(container, type = 'default') {
        container.className = 'w-full h-full flex flex-col';
        container.innerHTML = `
            <main class="flex-1 p-6 overflow-y-auto animate-fadeIn">
                <div class="bg-background-primary p-6 rounded-xl shadow-special border border-border-color">
                    ${SkeletonLoaders.page(type)}
                </div>
            </main>
        `;
    },

    /**
     * Shows a centered loading spinner
     * @param {HTMLElement} container - Container element
     * @param {string} message - Loading message
     */
    showCenteredLoader(container, message = 'Loading...') {
        container.className = 'w-full h-full flex flex-col';
        container.innerHTML = `
            <main class="flex-1 p-6 overflow-y-auto animate-fadeIn">
                <div class="bg-background-primary p-6 rounded-xl shadow-special border border-border-color">
                    <div class="flex flex-col items-center justify-center py-12">
                        <div class="loading-spinner-lg animate-spin mb-4"></div>
                        <p class="text-text-secondary">${message}</p>
                    </div>
                </div>
            </main>
        `;
    },

    /**
     * Shows an error state
     * @param {HTMLElement} container - Container element
     * @param {string} title - Error title
     * @param {string} message - Error message
     * @param {Function} onRetry - Retry callback
     */
    showError(container, title = 'Error', message = 'Something went wrong', onRetry = null) {
        container.className = 'w-full h-full flex flex-col';
        const retryButton = onRetry ? `
            <button onclick="(${onRetry.toString()})()" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-hover transition-all duration-300 btn-animated hover-lift">
                <i class="fa-solid fa-refresh mr-2"></i>Try Again
            </button>
        ` : '';

        container.innerHTML = `
            <main class="flex-1 p-6 overflow-y-auto animate-fadeIn">
                <div class="bg-background-primary p-6 rounded-xl shadow-special border border-border-color">
                    <div class="text-center py-12 animate-scaleIn">
                        <i class="fa-solid fa-exclamation-triangle text-6xl text-red-500 mb-4 animate-bounce"></i>
                        <h2 class="text-2xl font-bold text-text-primary mb-2 animate-fadeInUp">${title}</h2>
                        <p class="text-text-secondary mb-6 animate-fadeInUp animate-stagger-1">${message}</p>
                        <div class="animate-fadeInUp animate-stagger-2">
                            ${retryButton}
                        </div>
                    </div>
                </div>
            </main>
        `;
    },

    /**
     * Sets a button to loading state
     * @param {HTMLButtonElement} button - Button element
     * @param {string} loadingText - Loading text
     */
    setButtonLoading(button, loadingText = 'Loading...') {
        if (!button.originalText) {
            button.originalText = button.innerHTML;
        }
        button.disabled = true;
        button.classList.add('btn-loading');
        button.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i>${loadingText}`;
    },

    /**
     * Resets a button from loading state
     * @param {HTMLButtonElement} button - Button element
     */
    resetButton(button) {
        button.disabled = false;
        button.classList.remove('btn-loading');
        if (button.originalText) {
            button.innerHTML = button.originalText;
        }
    },

    /**
     * Shows an empty state
     * @param {HTMLElement} container - Container element
     * @param {string} title - Empty state title
     * @param {string} message - Empty state message
     * @param {string} actionText - Action button text
     * @param {string} actionHref - Action button href
     */
    showEmptyState(container, title = 'No data found', message = 'There are no items to display', actionText = null, actionHref = null) {
        const actionButton = actionText && actionHref ? `
            <a href="${actionHref}" class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-all duration-300 btn-animated hover-lift">
                <i class="fa-solid fa-plus mr-2"></i>${actionText}
            </a>
        ` : '';

        const content = `
            <div class="text-center py-12 animate-fadeIn">
                <i class="fa-solid fa-inbox text-6xl text-primary mb-4 opacity-50 animate-pulse"></i>
                <h3 class="text-xl font-semibold text-text-primary mb-2 animate-fadeInUp">${title}</h3>
                <p class="text-text-secondary mb-6 animate-fadeInUp animate-stagger-1">${message}</p>
                <div class="animate-fadeInUp animate-stagger-2">
                    ${actionButton}
                </div>
            </div>
        `;

        // If container is already a main element, just set content
        if (container.tagName === 'MAIN') {
            container.innerHTML = content;
        } else {
            container.className = 'w-full h-full flex flex-col';
            container.innerHTML = `
                <main class="flex-1 p-6 overflow-y-auto animate-fadeIn">
                    <div class="bg-background-primary p-6 rounded-xl shadow-special border border-border-color">
                        ${content}
                    </div>
                </main>
            `;
        }
    },

    /**
     * Adds staggered animation to elements
     * @param {HTMLElement} container - Container with elements to animate
     * @param {string} selector - CSS selector for elements to animate
     * @param {string} animationClass - Animation class to add
     */
    addStaggeredAnimation(container, selector = 'tr, .card, .item', animationClass = 'animate-fadeInUp') {
        const elements = container.querySelectorAll(selector);
        elements.forEach((el, index) => {
            el.classList.add(animationClass, `animate-stagger-${(index % 4) + 1}`);
        });
    }
};