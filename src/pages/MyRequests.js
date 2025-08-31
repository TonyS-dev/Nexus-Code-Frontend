import { auth } from '../services/auth.service.js';
import { getRequestsByEmployeeId } from '../services/api.service.js';
import { router } from '../router/router.js';

export function showMyRequestsPage() {
    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col';

    container.innerHTML = `<div class="p-6 text-text-secondary">Loading your requests...</div>`;

    async function loadAndRender() {
        try {
            const user = auth.getUser();
            const requests = await getRequestsByEmployeeId(user.id);

            container.innerHTML = `
                <main class="flex-1 p-6 overflow-y-auto">
                    <div class="bg-background-primary p-6 rounded-xl shadow-special border border-border-color">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 animate-fadeInUp">
                            <h2 class="text-xl font-semibold text-text-primary mb-4">Request History</h2>
                            <button id="new-request-btn" class="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors">
                            New Request
                            </button>
                        </div>
                            ${
                                requests.length > 0
                                        ? renderTable(requests)
                                        : renderEmpty()
                                }
                    </div>
                </main>
            `;

            container
                .querySelector('#new-request-btn')
                .addEventListener('click', () => {
                    router.navigate('/requests/new');
                });
        } catch (error) {
            container.innerHTML = `<div class="m-6 bg-danger/10 text-danger p-4 rounded-lg">Error loading requests: ${error.message}</div>`;
        }
    }

    function renderTable(requests) {
        const statusStyles = {
            Pending: 'bg-warning/10 text-yellow-600',
            Approved: 'bg-success/10 text-green-600',
            Rejected: 'bg-danger/10 text-red-600',
        };
        const rows = requests
            .map((req) => {
                const statusClass =
                    statusStyles[req.name] ||
                    'bg-gray-100 text-gray-600';
                return `
                <tr class="hover:bg-background-secondary transition-colors">
                    <td class="py-3 px-4 text-sm text-text-secondary">${new Date(
                        req.created_at
                    ).toLocaleDateString()}</td>
                    <td class="py-3 px-4 font-medium text-text-primary">${
                        req.request_type
                    }</td>
                    <td class="py-3 px-4">
                        <span class="px-2 py-1 text-xs font-semibold rounded-full ${statusClass}">
                            ${req.name}
                        </span>
                    </td>
                    <td class="py-3 px-4 text-right">
                        <button class="text-primary hover:underline text-sm font-semibold" data-id="${
                            req.id
                        }">Details</button>
                    </td>
                </tr>
            `;
            })
            .join('');

        return `
            <div class="overflow-x-auto bg-background-primary rounded-lg border border-border-color animate-fadeInUp animate-stagger-2">
                <table class="w-full text-left">
                    <thead>
                        <tr class="border-b border-border-color bg-background-secondary">
                            <th class="py-2 px-4 font-semibold text-text-secondary text-sm">Date</th>
                            <th class="py-2 px-4 font-semibold text-text-secondary text-sm">Type</th>
                            <th class="py-2 px-4 font-semibold text-text-secondary text-sm">Status</th>
                            <th class="py-2 px-4"></th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;
    }

    function renderEmpty() {
        return `<div class="text-center py-12 border-2 border-dashed border-border-color rounded-lg">
            <i class="fa-solid fa-file-circle-xmark text-4xl text-text-muted mb-4"></i>
            <h3 class="font-semibold text-text-primary">No Requests Found</h3>
            <p class="text-text-secondary text-sm">You haven't made any requests yet.</p>
        </div>`;
    }

    loadAndRender();
    return container;
}
