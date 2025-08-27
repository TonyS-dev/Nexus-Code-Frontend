// frontend/src/pages/myRequests.js
import { auth } from '../services/auth.js';
import { requestService } from '../services/requestService.js';
import { router } from '../router/router.js';
import { renderCalendar } from '../components/Calendar.js';

// --- Main Page Component ---
export function showMyRequestsPage() {
    const container = document.createElement('div');
    container.className = 'my-requests-container';
    container.innerHTML = `<div class="loading-spinner"></div><p>Loading your requests...</p>`;

    async function loadData() {
        try {
            const user = auth.getUser();
            if (!user) throw new Error('User not found.');

            // Fetch all requests for the employee
            const allRequests = await requestService.getRequestsByEmployee(
                user.id
            );

            // Render the full page with the fetched data
            renderPageContent(container, allRequests);
            // Attach all event listeners to the new content
            setupEventListeners(container);
        } catch (error) {
            container.innerHTML = `<div class="error-container"><h2>Could not load requests</h2><p>${error.message}</p></div>`;
        }
    }

    loadData();
    return container;
}

// --- Rendering Functions ---

function renderPageContent(container, requests) {
    container.innerHTML = `
        <div class="main-header">
            <h1>My Requests</h1>
            <button class="btn btn-primary" data-action="new-request">New Request</button>
        </div>
        <div class="content-section">
            <div class="section-header">
                <h2>Request History</h2>
            </div>
            ${
                requests.length > 0
                    ? renderRequestsTable(requests)
                    : renderEmptyState()
            }
        </div>
        <div id="calendar-container" class="calendar-container"></div>
    `;

    const calendarContainer = container.querySelector('#calendar-container');
    if (requests.length > 0) {
        renderCalendar(calendarContainer, requests);
    }
}

function renderRequestsTable(requests) {
    const rows = requests
        .map((req) => {
            const statusClass = req.status_name?.toLowerCase() || 'unknown';
            return `
            <tr class="request-row">
                <td>${new Date(req.created_at).toLocaleDateString()}</td>
                <td>${req.request_type}</td>
                <td><span class="status-badge status-${statusClass}">${
                req.status_name
            }</span></td>
                <td>
                    <button class="btn-icon" data-action="view" data-id="${
                        req.id
                    }" title="View Details"><i class="fa-solid fa-eye"></i></button>
                </td>
            </tr>
        `;
        })
        .join('');

    return `
        <table class="requests-table">
            <thead><tr><th>Date</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

function renderEmptyState() {
    return `
        <div class="empty-state">
            <h3>No Requests Found</h3>
            <p>Click the button to create your first request.</p>
            <button class="btn btn-primary" data-action="new-request">New Request</button>
        </div>
    `;
}

// --- Event Handling ---
function setupEventListeners(container) {
    container.addEventListener('click', (e) => {
        const actionTarget = e.target.closest('[data-action]');
        if (!actionTarget) return;
        const { action, id } = actionTarget.dataset;

        if (action === 'new-request') {
            router.navigate('/requests/new');
        } else if (action === 'view') {
            alert(`Viewing details for request ${id}`); // !TODO: Maybe add a Modal logic
        }
    });
}
