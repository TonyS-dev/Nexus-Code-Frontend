// frontend/src/pages/adminRequests.js
import { apiRequest } from '../services/api.js';
import { router } from '../router/router.js';

export function showAdminRequestsPage() {
    const container = document.createElement('div');
    container.className = 'content-section';
    container.innerHTML = `<div class="loading">Loading pending requests...</div>`;

    async function loadRequests() {
        try {
            const requests = await apiRequest('/requests/pending');
            const rows = requests
                .map(
                    (req) => `
              <tr>
                <td>${req.employee?.first_name || ''} ${
                        req.employee?.last_name || ''
                    }</td>
                <td>${req.request_type}</td>
                <td>${new Date(
                    req.start_date
                ).toLocaleDateString()} → ${new Date(
                        req.end_date
                    ).toLocaleDateString()}</td>
                <td><span class="status pending">Pending</span></td>
                <td>
                  <button class="btn-sm btn-approve" data-id="${
                      req.id
                  }">Approve</button>
                  <button class="btn-sm btn-reject" data-id="${
                      req.id
                  }">Reject</button>
                </td>
              </tr>
            `
                )
                .join('');

            container.innerHTML = `
              <h1>Pending Requests (HR)</h1>
              <table class="data-table">
                <thead>...</thead>
                <tbody>${
                    rows || '<tr><td colspan="5">No pending requests.</td></tr>'
                }</tbody>
              </table>
            `;

            // Attach event listeners AFTER rendering the content
            container.querySelectorAll('.btn-approve').forEach((btn) => {
                btn.onclick = async () => {
                    await apiRequest(
                        `/requests/${btn.dataset.id}/approve`,
                        'PATCH'
                    );
                    router.navigate('/admin-requests'); // Re-render the page
                };
            });

        } catch (error) {
            container.innerHTML = `<div class="alert error">Error: ${error.message}</div>`;
        }
    }

    loadRequests();
    return container;
}
