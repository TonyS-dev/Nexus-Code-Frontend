/**
 * @file SkeletonLoader.js
 * @description Reusable skeleton loading components
 */

export const SkeletonLoaders = {
    /**
     * Creates a table skeleton loader
     * @param {number} rows - Number of skeleton rows
     * @param {Array} columns - Array of column configurations
     */
    table(rows = 5, columns = ['60%', '80%', '40%', '50%', '80px']) {
        return `
            <div class="overflow-x-auto bg-background-primary rounded-lg border border-border-color animate-fadeIn">
                <table class="w-full text-left">
                    <thead>
                        <tr class="border-b border-border-color bg-background-secondary">
                            ${columns.map(width => `
                                <th class="py-3 px-4">
                                    <div class="skeleton skeleton-text" style="width: ${width}; height: 14px;"></div>
                                </th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${Array.from({ length: rows }, (_, i) => `
                            <tr class="border-b border-border-color animate-stagger-${(i % 4) + 1}">
                                ${columns.map((width, j) => `
                                    <td class="py-3 px-4">
                                        ${j === columns.length - 1 ? 
                                            `<div class="flex space-x-2 justify-end">
                                                <div class="skeleton skeleton-button" style="width: 60px; height: 28px;"></div>
                                                <div class="skeleton skeleton-button" style="width: 60px; height: 28px;"></div>
                                            </div>` :
                                            `<div class="skeleton skeleton-text" style="width: ${width};"></div>`
                                        }
                                    </td>
                                `).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    /**
     * Creates a form skeleton loader
     * @param {number} fields - Number of form fields
     */
    form(fields = 6) {
        return `
            <div class="space-y-6 animate-fadeIn">
                <div class="bg-background-secondary p-6 rounded-lg border border-border-color">
                    <div class="skeleton skeleton-text skeleton-title mb-4"></div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        ${Array.from({ length: fields }, (_, i) => `
                            <div class="animate-stagger-${(i % 4) + 1}">
                                <div class="skeleton skeleton-text" style="width: 30%; height: 14px; margin-bottom: 8px;"></div>
                                <div class="skeleton" style="height: 40px; border-radius: 8px;"></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="flex justify-end gap-4">
                    <div class="skeleton skeleton-button"></div>
                    <div class="skeleton skeleton-button" style="width: 120px;"></div>
                </div>
            </div>
        `;
    },

    /**
     * Creates a card grid skeleton loader
     * @param {number} cards - Number of cards
     */
    cardGrid(cards = 6) {
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                ${Array.from({ length: cards }, (_, i) => `
                    <div class="skeleton-card animate-stagger-${(i % 4) + 1}"></div>
                `).join('')}
            </div>
        `;
    },

    /**
     * Creates a user card skeleton
     */
    userCard() {
        return `
            <div class="skeleton-user-card animate-fadeIn">
                <div class="flex items-center space-x-4">
                    <div class="skeleton-avatar"></div>
                    <div class="flex-1">
                        <div class="skeleton skeleton-text" style="width: 60%; margin-bottom: 8px;"></div>
                        <div class="skeleton skeleton-text" style="width: 80%;"></div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Creates a dashboard skeleton
     */
    dashboard() {
        return `
            <div class="space-y-6 animate-fadeIn">
                <!-- Header -->
                <div class="flex justify-between items-center">
                    <div class="skeleton skeleton-text skeleton-title"></div>
                    <div class="skeleton skeleton-button"></div>
                </div>
                
                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    ${Array.from({ length: 4 }, (_, i) => `
                        <div class="bg-background-secondary p-6 rounded-lg border border-border-color animate-stagger-${i + 1}">
                            <div class="skeleton skeleton-text" style="width: 40%; margin-bottom: 12px;"></div>
                            <div class="skeleton skeleton-text" style="width: 60%; height: 2em;"></div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Content Area -->
                <div class="bg-background-primary p-6 rounded-xl border border-border-color">
                    <div class="skeleton skeleton-text skeleton-title mb-6"></div>
                    ${this.table(8, ['50%', '70%', '40%', '60%', '80px'])}
                </div>
            </div>
        `;
    },

    /**
     * Creates a loading spinner
     */
    spinner(size = 'md') {
        const sizeClass = {
            sm: 'loading-spinner',
            md: 'loading-spinner-lg',
            lg: 'w-16 h-16 border-4 border-primary/20 border-t-primary'
        }[size];

        return `
            <div class="flex items-center justify-center p-8">
                <div class="${sizeClass} animate-spin"></div>
            </div>
        `;
    },

    /**
     * Creates a page loading skeleton
     */
    page(type = 'default') {
        const templates = {
            default: this.dashboard(),
            table: `
                <div class="space-y-6">
                    <div class="flex justify-between items-center">
                        <div class="skeleton skeleton-text skeleton-title"></div>
                        <div class="skeleton skeleton-button"></div>
                    </div>
                    ${this.table()}
                </div>
            `,
            form: this.form(),
            cards: this.cardGrid()
        };

        return templates[type] || templates.default;
    }
};

/**
 * Skeleton loader component with animation timing
 * @param {string} type - Type of skeleton loader
 * @param {Object} options - Configuration options
 */
export function createSkeletonLoader(type = 'default', options = {}) {
    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col';
    container.innerHTML = `
        <main class="flex-1 p-6 overflow-y-auto">
            <div class="bg-background-primary p-6 rounded-xl shadow-special border border-border-color">
                ${SkeletonLoaders.page(type)}
            </div>
        </main>
    `;
    return container;
}