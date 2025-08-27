import { auth } from '../services/auth.js';
import { requestService } from '../services/requestService.js';
import { router } from '../router/router.js';

// --- Main Page Component ---
export function showMyVacationRequestsPage() {
    const container = document.createElement('div');
    container.className = 'my-requests-container';
    container.innerHTML = `<div class="loading-spinner"></div><p>Loading your vacation data...</p>`;

    // Asynchronously load all necessary data
    async function loadData() {
        try {
            const user = auth.getUser();
            if (!user) throw new Error('User not found.');

            // Fetch all data in parallel for better performance
            const [allRequests, balance] = await Promise.all([
                requestService.getRequestsByEmployee(user.id),
                requestService.getVacationBalance(user.id),
            ]);

            // Filter only the vacation requests for this specific view
            const vacationRequests = allRequests.filter(
                (req) => req.request_type === 'vacation'
            );

            // Render the full page with the fetched data
            renderPageContent(container, vacationRequests, balance);
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

function renderPageContent(container, requests, balance) {
    container.innerHTML = `
        ${renderHeader()}
        ${renderSummaryCards(balance)}
        <div class="content-section">
            ${renderSectionHeader()}
            ${
                requests.length > 0
                    ? renderRequestsTable(requests)
                    : renderEmptyState()
            }
        </div>
    `;
}

function renderHeader() {
    return `
        <div class="main-header">
            <h1>My Vacation Requests</h1>
            <div class="header-actions">
                <button class="btn btn-primary" data-action="new-request">
                    <i class="fa-solid fa-plus"></i> New Request
                </button>
            </div>
        </div>
    `;
}

function renderSummaryCards(balance) {
    return `
        <div class="vacation-summary-cards">
            <div class="summary-card"><h3>Available Days</h3><span class="count">${
                balance?.available_days ?? 0
            }</span></div>
            <div class="summary-card"><h3>Days Taken</h3><span class="count">${
                balance?.days_taken ?? 0
            }</span></div>
            <div class="summary-card"><h3>Remaining</h3><span class="count">${
                (balance?.available_days ?? 0) - (balance?.days_taken ?? 0)
            }</span></div>
        </div>
    `;
}

function renderSectionHeader() {
    const currentYear = new Date().getFullYear();
    let yearOptions = '';
    for (let i = 0; i < 5; i++) {
        yearOptions += `<option value="${currentYear - i}">${
            currentYear - i
        }</option>`;
    }

    return `
        <div class="section-header">
            <h2>Request History</h2>
            <div class="filter-controls">
                <select id="status-filter">
                    <option value="all">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
                <select id="year-filter">
                    <option value="all">All Years</option>
                    ${yearOptions}
                </select>
            </div>
        </div>
    `;
}

function renderRequestsTable(requests) {
    const rows = requests
        .map(
            (req) => `
        <tr class="request-row" data-year="${new Date(
            req.created_at
        ).getFullYear()}" data-status="${req.status_name}">
            <td>${new Date(req.created_at).toLocaleDateString()}</td>
            <td>${req.vacation_type_name || 'N/A'}</td>
            <td><span class="status-badge status-${req.status_name?.toLowerCase()}">${
                req.status_name
            }</span></td>
            <td>${req.days_requested}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" data-action="view" data-id="${
                        req.id
                    }" title="View Details"><i class="fa-solid fa-eye"></i></button>
                    ${
                        req.status_name === 'Pending'
                            ? `<button class="btn-icon" data-action="cancel" data-id="${req.id}" title="Cancel Request"><i class="fa-solid fa-times"></i></button>`
                            : ''
                    }
                </div>
            </td>
        </tr>
    `
        )
        .join('');

    return `
        <table class="requests-table">
            <thead><tr><th>Date</th><th>Type</th><th>Status</th><th>Days</th><th>Actions</th></tr></thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

function renderEmptyState() {
    return `
        <div class="empty-state">
            <h3>No Vacation Requests Found</h3>
            <p>Click the button to create your first vacation request.</p>
            <button class="btn btn-primary" data-action="new-request">New Request</button>
        </div>
    `;
}

// --- Event Handling and Logic ---

function setupEventListeners(container) {
    container.addEventListener('click', (e) => {
        const actionTarget = e.target.closest('[data-action]');
        if (!actionTarget) return;

        const { action, id } = actionTarget.dataset;

        switch (action) {
            case 'new-request':
                router.navigate('/vacations/new');
                break;
            case 'view':
                // !TODO: Implement view request details modal
                alert(`Viewing details for request ${id}`);
                break;
            case 'cancel':
                // !TODO: Implement cancel request logic with confirmation
                alert(`Cancelling request ${id}`);
                break;
        }
    });

    const statusFilter = container.querySelector('#status-filter');
    const yearFilter = container.querySelector('#year-filter');

    const handleFilterChange = () => {
        const status = statusFilter.value;
        const year = yearFilter.value;

        container.querySelectorAll('.request-row').forEach((row) => {
            const rowStatus = row.dataset.status;
            const rowYear = row.dataset.year;

            const statusMatch = status === 'all' || rowStatus === status;
            const yearMatch = year === 'all' || rowYear === year;

            row.style.display = statusMatch && yearMatch ? '' : 'none';
        });
    };

    if (statusFilter)
        statusFilter.addEventListener('change', handleFilterChange);
    if (yearFilter) yearFilter.addEventListener('change', handleFilterChange);
}
