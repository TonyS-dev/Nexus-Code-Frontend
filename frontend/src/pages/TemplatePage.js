/**
 * @file YourNewPage.js
 * @description Template for creating a new page component that fetches data from the API.
 * 1. Rename this file (e.g., ManageUsers.js).
 * 2. Change the function name (e.g., showManageUsersPage).
 * 3. Update the API call in `loadData`.
 * 4. Implement the rendering logic in `renderContent`.
 * 5. Add the new page to `router/router.js`.
 */
import { apiRequest } from '../services/api.service.js';

export function showYourNewPage() {
    const container = document.createElement('div');
    container.className = 'your-new-page-container'; // Use a unique class for styling

    // Set initial loading state. This provides immediate feedback to the user.
    container.innerHTML = `<div class="loading">Loading page content...</div>`;

    /**
     * Fetches required data and renders the page content.
     */
    async function loadData() {
        try {
            // STEP 1: Replace this with the actual API call you need for this page.
            const pageData = await apiRequest('/your-endpoint');

            // STEP 2: Render the main content using the fetched data.
            renderContent(container, pageData);
        } catch (error) {
            // If the API call fails, display a clear error message.
            console.error('Failed to load page data:', error);
            container.innerHTML = `<div class="alert error">Error: ${error.message}</div>`;
        }
    }

    /**
     * Renders the HTML structure of the page.
     * @param {HTMLElement} containerEl - The main container element for the page.
     * @param {any} data - The data fetched from the API.
     */
    function renderContent(containerEl, data) {
        // STEP 3: Write your HTML structure here.
        // Use the 'data' parameter to dynamically create lists, tables, etc.
        containerEl.innerHTML = `
            <div class="main-header">
                <h1>Your New Page Title</h1>
                <p>A brief description of this page.</p>
            </div>
            <div class="content-section">
                <h2>Data Section</h2>
                <pre>${JSON.stringify(
                    data,
                    null,
                    2
                )}</pre> <!-- Example: Display raw data -->
            </div>
        `;

        // STEP 4: Add any event listeners for buttons or interactive elements.
        setupEventListeners(containerEl);
    }

    /**
     * Attaches event listeners to the page's interactive elements.
     * @param {HTMLElement} containerEl - The main container element.
     */
    function setupEventListeners(containerEl) {
        // const someButton = containerEl.querySelector('#some-button');
        // if (someButton) {
        //     someButton.addEventListener('click', () => {
        //         console.log('Button clicked!');
        //     });
        // }
    }

    // Initial call to start the data fetching process.
    loadData();

    return container;
}
