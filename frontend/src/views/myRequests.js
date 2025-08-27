// frontend/src/pages/myRequests.js
import { auth } from '../services/auth.js';
import { apiRequest } from '../services/api.js';
import { router } from '../router/router.js';

export function showMyRequestsPage() {
    const user = auth.getUser();
    const container = document.createElement('div');
    container.className = 'content-section';

    // Immediately show a "Loading..." state
    container.innerHTML = `
        <div class="header-with-button">
            <h1>My Requests</h1>
            <button id="btn-new-request" class="btn btn-primary">New Request</button>
        </div>
        <div class="loading">Loading your requests...</div>
    `;

    // Assign the button event immediately
    container
        .querySelector('#btn-new-request')
        .addEventListener('click', () => {
            router.navigate('/requests/new');
        });

    // Define an async function to load the data
    async function loadRequests() {
        try {
            // Call the backend endpoint
            const requests = await apiRequest(`/requests/employee/${user.id}`);

            const tableRows =
                requests.length > 0
                    ? requests
                          .map(
                              (req) => `
                    <tr>
                        <td>${new Date(
                            req.created_at
                        ).toLocaleDateString()}</td>
                        <td>${req.request_type}</td>
                        <td><span class="status ${req.status_name?.toLowerCase()}">${
                                  req.status_name
                              }</span></td>
                        <td>${req.comments || '–'}</td>
                    </tr>
                `
                          )
                          .join('')
                    : `<tr><td colspan="4" class="text-center">You don't have any requests yet.</td></tr>`;

            // Replace "Loading..." with the actual data table
            const tableHTML = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Creation Date</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Comments</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            `;
            container.querySelector('.loading').remove();
            container.insertAdjacentHTML('beforeend', tableHTML);
        } catch (error) {
            container.querySelector(
                '.loading'
            ).innerHTML = `<div class="alert error">Error loading requests: ${error.message}</div>`;
        }
    }

    // Call the data loading function
    loadRequests();

    // Return the container immediately (will show "Loading...")
    return container;
}
