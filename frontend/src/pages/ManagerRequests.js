/**
 * @file ManagerRequests.js
 * @description Page for managers/admins to view and approve pending requests.
 */
import {
    getPendingManagerRequests,
    approveRequest,
} from '../services/api.service.js';
import { auth } from '../services/auth.service.js';

export function showManagerRequestsPage() {
    const container = document.createElement('div');
    container.className = 'manager-requests-container';
    container.innerHTML = `<div class="loading">Loading pending requests...</div>`;

    async function loadData() {
        try {
            // Your backend should have an endpoint that returns requests needing this user's approval.
            const requests = await getPendingManagerRequests();

            container.innerHTML = `
                <div class="main-header">
                    <h1>Pending Approvals</h1>
                    <p>Review requests from your team members.</p>
                </div>
                <div class="content-section">
                    ${
                        requests.length > 0
                            ? renderRequestsTable(requests)
                            : '<p>No requests are currently pending your approval.</p>'
                    }
                </div>
            `;

            // Add event listeners for approve/reject buttons.
            container.querySelectorAll('[data-action]').forEach((button) => {
                button.addEventListener('click', handleActionClick);
            });
        } catch (error) {
            container.innerHTML = `<div class="alert error">Failed to load requests: ${error.message}</div>`;
        }
    }

    loadData();
    return container;
}

function renderRequestsTable(requests) {
    const rows = requests
        .map(
            (req) => `
        <tr>
            <td>${req.employee_first_name} ${req.employee_last_name}</td>
            <td>${req.request_type}</td>
            <td>${new Date(req.created_at).toLocaleDateString()}</td>
            <td><span class="status-badge status-pending">${
                req.status_name
            }</span></td>
            <td>
                <button class="btn-sm btn-approve" data-action="approve" data-id="${
                    req.id
                }">Approve</button>
                <button class="btn-sm btn-reject" data-action="reject" data-id="${
                    req.id
                }">Reject</button>
            </td>
        </tr>
    `
        )
        .join('');

    return `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Employee</th>
                    <th>Type</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

async function handleActionClick(event) {
    const { action, id } = event.target.dataset;
    const user = auth.getUser();

    // You need to get the correct status UUIDs from your DB/backend.
    // These are placeholders.
    const statusMap = {
        approve: 'c0ff36f5-68cb-49fc-87cc-6a21a6f07d90', // 'Approved'
        reject: 'c669d605-5d7a-4dc9-ae9c-f7ecc50592e5', // 'Rejected'
    };

    const comments = prompt(`Enter comments for this ${action}:`);

    try {
        await approveRequest(id, {
            approver_id: user.id,
            status_id: statusMap[action],
            comments: comments || 'No comments.',
        });
        alert(`Request has been ${action}d.`);
        // Reload the page content
        const pageContainer = document.querySelector(
            '.manager-requests-container'
        );
        pageContainer.innerHTML = `<div class="loading">Reloading...</div>`;
        // This is a simplified reload, ideally you would just re-run the loadData function.
        window.location.reload();
    } catch (error) {
        alert(`Failed to ${action} request: ${error.message}`);
    }
}
