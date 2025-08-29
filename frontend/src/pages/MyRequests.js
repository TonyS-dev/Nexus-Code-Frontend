/**
 * @file MyRequests.js
 * @description Displays the user's request history in a table and calendar view.
 */
import { auth } from '../services/auth.service.js';
import { getRequestsByEmployeeId } from '../services/api.service.js';
import { router } from '../router/router.js';
// Note: You will need to add FullCalendar to your project: npm install @fullcalendar/core @fullcalendar/daygrid
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

export function showMyRequestsPage() {
    const container = document.createElement('div');
    container.className = 'my-requests-container';
    container.innerHTML = `<div class="loading">Loading your requests...</div>`;

    async function loadAndRenderRequests() {
        try {
            const user = auth.getUser();
            const requests = await getRequestsByEmployeeId(user.id);

            container.innerHTML = `
                <div class="main-header">
                    <h1>My Requests</h1>
                    <button id="new-request-btn" class="btn btn-primary">New Request</button>
                </div>
                <div class="content-section">
                    <h2>Request History</h2>
                    ${
                        requests.length > 0
                            ? renderRequestsTable(requests)
                            : renderEmptyState()
                    }
                </div>
                <div class="content-section">
                    <h2>Calendar View</h2>
                    <div id="calendar"></div>
                </div>
            `;

            // Initialize Calendar if there are requests
            if (requests.length > 0) {
                const calendarEl = container.querySelector('#calendar');
                const calendarEvents = requests.map((req) => ({
                    title: req.request_type,
                    // Assuming requests have start_date and end_date
                    start: req.start_date || req.created_at,
                    end: req.end_date,
                    color:
                        req.status_name === 'Approved'
                            ? '#27ae60'
                            : req.status_name === 'Rejected'
                            ? '#e74c3c'
                            : '#f39c12',
                }));

                const calendar = new Calendar(calendarEl, {
                    plugins: [dayGridPlugin],
                    initialView: 'dayGridMonth',
                    events: calendarEvents,
                });
                calendar.render();
            }

            container
                .querySelector('#new-request-btn')
                .addEventListener('click', () => {
                    router.navigate('/requests/new');
                });
        } catch (error) {
            container.innerHTML = `<div class="alert error">Error loading requests: ${error.message}</div>`;
        }
    }

    loadAndRenderRequests();
    return container;
}

function renderRequestsTable(requests) {
    const rows = requests
        .map((req) => {
            const statusClass = (req.status_name || 'pending')
                .toLowerCase()
                .replace(' ', '-');
            return `
        <tr>
            <td>${new Date(req.created_at).toLocaleDateString()}</td>
            <td>${req.request_type}</td>
            <td><span class="status-badge status-${statusClass}">${
                req.status_name
            }</span></td>
            <td><button class="btn-sm btn-view" data-id="${
                req.id
            }">Details</button></td>
        </tr>
    `;
        })
        .join('');

    return `
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr><th>Date</th><th>Type</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}

function renderEmptyState() {
    return `<p>You haven't made any requests yet.</p>`;
}
