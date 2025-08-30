/**
 * @file ManagerRequests.js
 * @description Page for managers/admins to view and approve pending requests.
 */
import { auth } from '../services/auth.service.js';
import { getPendingManagerRequests, approveRequest, getRequestStatuses } from '../services/api.service.js';

export function showManagerRequestsPage() {
    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col';

    container.innerHTML = `<div class="p-6 text-text-secondary">Loading pending requests...</div>`;

    let requestStatuses = [];

    async function loadAndRender() {
        try {
            const user = auth.getUser();
            
            // Load both pending requests and request statuses
            const [requests, statuses] = await Promise.all([
                getPendingManagerRequests(user.id),
                getRequestStatuses()
            ]);
            
            requestStatuses = statuses;

            container.innerHTML = `
                <main class="flex-1 p-6 overflow-y-auto">
                    <div class="bg-background-primary p-6 rounded-xl shadow-special border border-border-color">
                        <div class="flex justify-between items-center mb-6">
                            <div>
                                <h2 class="text-xl font-semibold text-text-primary">Pending Approvals</h2>
                                <p class="text-text-secondary text-sm mt-1">Review requests from your team members</p>
                            </div>
                            <div class="text-sm text-text-secondary bg-background-secondary px-3 py-2 rounded-lg">
                                ${requests.length} pending request${requests.length !== 1 ? 's' : ''}
                            </div>
                        </div>
                        ${
                            requests.length > 0
                                ? renderRequestsTable(requests)
                                : renderEmpty()
                        }
                    </div>
                </main>

                <!-- Approval Modal -->
                <div id="approval-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
                    <div class="bg-background-primary p-6 rounded-xl shadow-special border border-border-color max-w-md w-full mx-4">
                        <div class="flex justify-between items-center mb-4">
                            <h3 id="modal-title" class="text-lg font-semibold text-text-primary"></h3>
                            <button id="close-modal" class="text-text-secondary hover:text-text-primary">
                                <i class="fa-solid fa-times"></i>
                            </button>
                        </div>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-text-secondary mb-2">Comments (optional)</label>
                                <textarea 
                                    id="approval-comments" 
                                    rows="3" 
                                    class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background-primary text-text-primary"
                                    placeholder="Add any comments about this decision..."></textarea>
                            </div>
                            <div class="flex gap-3 justify-end">
                                <button id="cancel-approval" class="px-4 py-2 border border-border-color rounded-lg text-text-secondary hover:bg-background-secondary transition-colors">
                                    Cancel
                                </button>
                                <button id="confirm-approval" class="px-4 py-2 rounded-lg text-white font-medium transition-colors">
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Add event listeners
            addEventListeners();

        } catch (error) {
            container.innerHTML = `<div class="m-6 bg-danger/10 text-danger p-4 rounded-lg">Error loading requests: ${error.message}</div>`;
        }
    }

    function renderRequestsTable(requests) {
        const rows = requests
            .map((req) => {
                const requestDate = new Date(req.created_at).toLocaleDateString();
                const employeeName = `${req.employee_first_name} ${req.employee_last_name}`;
                
                return `
                <tr class="hover:bg-background-secondary transition-colors">
                    <td class="py-4 px-4 text-sm text-text-secondary">${requestDate}</td>
                    <td class="py-4 px-4 font-medium text-text-primary">${employeeName}</td>
                    <td class="py-4 px-4 text-text-primary">${req.request_type}</td>
                    <td class="py-4 px-4">
                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-warning/10 text-yellow-600">
                            ${req.status_name || 'Pending'}
                        </span>
                    </td>
                    <td class="py-4 px-4 text-right">
                        <div class="flex gap-2 justify-end">
                            <button 
                                class="view-details-btn bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm font-medium transition-colors" 
                                data-request='${JSON.stringify(req).replace(/'/g, "&apos;")}'>
                                <i class="fa-solid fa-eye mr-1"></i>Details
                            </button>
                            <button 
                                class="approve-btn bg-success hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors" 
                                data-id="${req.request_id}" 
                                data-employee="${employeeName}"
                                data-type="${req.request_type}">
                                <i class="fa-solid fa-check mr-1"></i>Approve
                            </button>
                            <button 
                                class="reject-btn bg-danger hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors" 
                                data-id="${req.request_id}"
                                data-employee="${employeeName}"
                                data-type="${req.request_type}">
                                <i class="fa-solid fa-times mr-1"></i>Reject
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            })
            .join('');

        return `
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead>
                        <tr class="border-b-2 border-border-color">
                            <th class="py-3 px-4 font-semibold text-text-secondary text-sm">Date</th>
                            <th class="py-3 px-4 font-semibold text-text-secondary text-sm">Employee</th>
                            <th class="py-3 px-4 font-semibold text-text-secondary text-sm">Type</th>
                            <th class="py-3 px-4 font-semibold text-text-secondary text-sm">Status</th>
                            <th class="py-3 px-4 font-semibold text-text-secondary text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;
    }

    function renderEmpty() {
        return `
            <div class="text-center py-16 border-2 border-dashed border-border-color rounded-lg">
                <i class="fa-solid fa-clipboard-check text-4xl text-text-muted mb-4"></i>
                <h3 class="font-semibold text-text-primary mb-2">No Pending Requests</h3>
                <p class="text-text-secondary text-sm">All requests have been processed.</p>
            </div>
        `;
    }

    function addEventListeners() {
        // View Details buttons
        container.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const requestData = JSON.parse(e.target.dataset.request.replace(/&apos;/g, "'"));
                showRequestDetailsModal(requestData);
            });
        });

        // Approve buttons
        container.querySelectorAll('.approve-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const requestId = e.target.dataset.id;
                const employee = e.target.dataset.employee;
                const type = e.target.dataset.type;
                showApprovalModal(requestId, 'approve', employee, type);
            });
        });

        // Reject buttons
        container.querySelectorAll('.reject-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const requestId = e.target.dataset.id;
                const employee = e.target.dataset.employee;
                const type = e.target.dataset.type;
                showApprovalModal(requestId, 'reject', employee, type);
            });
        });

        // Modal event listeners
        const modal = container.querySelector('#approval-modal');
        const closeBtn = container.querySelector('#close-modal');
        const cancelBtn = container.querySelector('#cancel-approval');
        const confirmBtn = container.querySelector('#confirm-approval');

        [closeBtn, cancelBtn].forEach(btn => {
            btn?.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        });

        // Close modal when clicking outside
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    function showRequestDetailsModal(request) {
        const detailsModal = document.createElement('div');
        detailsModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        detailsModal.innerHTML = `
            <div class="bg-background-primary p-6 rounded-xl shadow-special border border-border-color max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-text-primary">Request Details</h3>
                    <button class="close-details-modal text-text-secondary hover:text-text-primary">
                        <i class="fa-solid fa-times"></i>
                    </button>
                </div>
                <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-text-secondary mb-1">Employee</label>
                            <p class="text-text-primary">${request.employee_first_name} ${request.employee_last_name}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-text-secondary mb-1">Request Type</label>
                            <p class="text-text-primary">${request.request_type}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-text-secondary mb-1">Date Submitted</label>
                            <p class="text-text-primary">${new Date(request.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-text-secondary mb-1">Status</label>
                            <p class="text-text-primary">${request.status_name || 'Pending'}</p>
                        </div>
                    </div>
                    ${request.comments ? `
                        <div>
                            <label class="block text-sm font-medium text-text-secondary mb-1">Request Comments</label>
                            <p class="text-text-primary bg-background-secondary p-3 rounded-lg">${request.comments}</p>
                        </div>
                    ` : ''}
                    <div class="flex justify-end pt-4">
                        <button class="close-details-modal bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(detailsModal);

        // Add event listeners for closing
        detailsModal.querySelectorAll('.close-details-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                document.body.removeChild(detailsModal);
            });
        });

        // Close when clicking outside
        detailsModal.addEventListener('click', (e) => {
            if (e.target === detailsModal) {
                document.body.removeChild(detailsModal);
            }
        });
    }

    function showApprovalModal(requestId, action, employeeName, requestType) {
        const modal = container.querySelector('#approval-modal');
        const modalTitle = container.querySelector('#modal-title');
        const confirmBtn = container.querySelector('#confirm-approval');
        const commentsTextarea = container.querySelector('#approval-comments');

        // Configure modal based on action
        const isApprove = action === 'approve';
        modalTitle.textContent = `${isApprove ? 'Approve' : 'Reject'} Request`;
        confirmBtn.textContent = isApprove ? 'Approve' : 'Reject';
        confirmBtn.className = `px-4 py-2 rounded-lg text-white font-medium transition-colors ${
            isApprove ? 'bg-success hover:bg-green-600' : 'bg-danger hover:bg-red-600'
        }`;

        // Clear previous comments
        commentsTextarea.value = '';

        // Show modal
        modal.classList.remove('hidden');

        // Handle confirm button
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        
        newConfirmBtn.addEventListener('click', async () => {
            await handleApprovalAction(requestId, action, commentsTextarea.value, employeeName, requestType);
            modal.classList.add('hidden');
        });
    }

    async function handleApprovalAction(requestId, action, comments, employeeName, requestType) {
        try {
            const user = auth.getUser();
            
            // Find the correct status ID based on action
            const statusId = findStatusId(action);
            if (!statusId) {
                throw new Error(`Could not find status ID for action: ${action}`);
            }

            // Show loading state
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
            loadingDiv.innerHTML = `
                <div class="bg-background-primary p-6 rounded-xl shadow-special">
                    <div class="flex items-center space-x-3">
                        <i class="fa-solid fa-spinner fa-spin text-primary"></i>
                        <span class="text-text-primary">Processing ${action}...</span>
                    </div>
                </div>
            `;
            document.body.appendChild(loadingDiv);

            await approveRequest(requestId, {
                approver_id: user.id,
                status_id: statusId,
                comments: comments || `Request ${action}d by ${user.first_name} ${user.last_name}`
            });

            // Remove loading
            document.body.removeChild(loadingDiv);

            // Show success message
            showNotification(`${requestType} request for ${employeeName} has been ${action}d successfully.`, 'success');

            // Reload the page content
            await loadAndRender();

        } catch (error) {
            // Remove loading if it exists
            const loadingDiv = document.querySelector('.fixed.inset-0');
            if (loadingDiv) {
                document.body.removeChild(loadingDiv);
            }
            
            showNotification(`Failed to ${action} request: ${error.message}`, 'error');
        }
    }

    function findStatusId(action) {
        const statusNames = {
            'approve': ['Approved', 'approved'],
            'reject': ['Rejected', 'rejected', 'Denied', 'denied']
        };
        
        const possibleNames = statusNames[action] || [];
        const status = requestStatuses.find(s => 
            possibleNames.some(name => 
                s.name.toLowerCase() === name.toLowerCase()
            )
        );
        
        return status?.id;
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md transition-all duration-300 ${
            type === 'success' 
                ? 'bg-success/10 text-green-600 border border-green-200' 
                : type === 'error'
                ? 'bg-danger/10 text-red-600 border border-red-200'
                : 'bg-primary/10 text-blue-600 border border-blue-200'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fa-solid ${
                    type === 'success' ? 'fa-check-circle' : 
                    type === 'error' ? 'fa-exclamation-circle' : 
                    'fa-info-circle'
                }"></i>
                <span class="text-sm font-medium">${message}</span>
                <button class="ml-2 text-current hover:opacity-70">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);

        // Manual close
        notification.querySelector('button').addEventListener('click', () => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        });
    }

    function renderRequestsTable(requests) {
        const rows = requests
            .map((req) => {
                const requestDate = new Date(req.created_at).toLocaleDateString();
                const employeeName = `${req.employee_first_name} ${req.employee_last_name}`;
                
                return `
                <tr class="hover:bg-background-secondary transition-colors border-b border-border-color last:border-b-0">
                    <td class="py-4 px-4 text-sm text-text-secondary">${requestDate}</td>
                    <td class="py-4 px-4 font-medium text-text-primary">${employeeName}</td>
                    <td class="py-4 px-4 text-text-primary capitalize">${req.request_type}</td>
                    <td class="py-4 px-4">
                        <span class="px-3 py-1 text-xs font-semibold rounded-full bg-warning/10 text-yellow-600">
                            ${req.status_name || 'Pending'}
                        </span>
                    </td>
                    <td class="py-4 px-4 text-right">
                        <div class="flex gap-2 justify-end">
                            <button 
                                class="view-details-btn bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors" 
                                data-request='${JSON.stringify(req).replace(/'/g, "&apos;")}'>
                                <i class="fa-solid fa-eye mr-1"></i>Details
                            </button>
                            <button 
                                class="approve-btn bg-success hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors" 
                                data-id="${req.request_id}" 
                                data-employee="${employeeName}"
                                data-type="${req.request_type}">
                                <i class="fa-solid fa-check mr-1"></i>Approve
                            </button>
                            <button 
                                class="reject-btn bg-danger hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors" 
                                data-id="${req.request_id}"
                                data-employee="${employeeName}"
                                data-type="${req.request_type}">
                                <i class="fa-solid fa-times mr-1"></i>Reject
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            })
            .join('');

        return `
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead>
                        <tr class="border-b-2 border-border-color">
                            <th class="py-3 px-4 font-semibold text-text-secondary text-sm">Date</th>
                            <th class="py-3 px-4 font-semibold text-text-secondary text-sm">Employee</th>
                            <th class="py-3 px-4 font-semibold text-text-secondary text-sm">Type</th>
                            <th class="py-3 px-4 font-semibold text-text-secondary text-sm">Status</th>
                            <th class="py-3 px-4 font-semibold text-text-secondary text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;
    }

    // Initialize the component
    loadAndRender();
    return container;
}