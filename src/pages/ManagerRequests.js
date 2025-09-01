/**
 * @file ManagerRequests.js
 * @description Page for managers/admins to view and approve ALL pending requests from all employees.
 */
import { auth } from "../services/auth.service.js";
import {
    getAllPendingRequests,
    approveRequest,
    getRequestStatuses,
} from "../services/api.service.js";

/**
 * Main function that creates and displays the request management page for managers
 * Allows viewing, filtering and approving/rejecting all pending employee requests
 */
export function showManagerRequestsPage() {
    // Create the main container of the page
    const container = document.createElement("div");
    container.className = "w-full h-full flex flex-col";

    // Show initial loading state 
    container.innerHTML = `
        <div class="p-4 sm:p-6 text-text-secondary flex items-center justify-center">
            <div class="w-6 h-6 sm:w-8 sm:h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
            <span class="ml-3 text-sm sm:text-base">Loading all pending requests...</span>
        </div>
    `;

    // Variable to store available request statuses (approved, rejected, etc.)
    let requestStatuses = [];

    /**
     * Asynchronous function that loads data and renders the complete interface
     * Gets all pending requests and available statuses
     */
    async function loadAndRender() {
        try {
            // Load data in parallel for better performance 
            const [allRequests, statuses] = await Promise.all([
                getAllPendingRequests(), // Get all pending requests
                getRequestStatuses(),    // Get possible statuses (approved, rejected, etc.)
            ]);

            requestStatuses = statuses;

            // Filter only requests that are actually pending
            // Check multiple variations of pending statuses
            const pendingRequests = allRequests.filter((request) => {
                const status = request.status_name || request.status || "";
                return (
                    status.toLowerCase() === "pending" ||
                    status.toLowerCase() === "submitted" ||
                    status.toLowerCase() === "awaiting approval" ||
                    !status // Without status, it is also considered pending
                );
            });

            // Render main interface with loaded data
            container.innerHTML = `
                <main class="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto">
                    <div class="bg-background-primary p-3 sm:p-4 lg:p-6 rounded-xl shadow-special border border-border-color">
                        <!-- Header with title and request counter -->
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                            <h2 class="text-lg sm:text-xl font-semibold text-text-primary">All Pending Approvals</h2>
                            <div class="text-xs sm:text-sm text-text-secondary bg-background-secondary px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
                                ${pendingRequests.length} pending request${pendingRequests.length !== 1 ? "s" : ""}
                            </div>
                        </div>
                        
                        <!-- Filter section - Mobile-first design -->
                        <div class="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4 mb-4 sm:mb-6">
                            <!-- Filter by request type -->
                            <div>
                                <label for="type-filter" class="block text-xs sm:text-sm font-medium text-text-secondary mb-2">Filter by type:</label>
                                <select id="type-filter" class="w-full px-3 py-2 text-sm sm:text-base border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary">
                                    <option value="">All Types</option>
                                    <option value="vacation">Vacation</option>
                                    <option value="leave">Leave</option>
                                    <option value="certificate">Certificate</option>
                                </select>
                            </div>
                            <!-- Search by employee name -->
                            <div>
                                <label for="search-input" class="block text-xs sm:text-sm font-medium text-text-secondary mb-2">Search:</label>
                                <input type="text" id="search-input" class="w-full px-3 py-2 text-sm sm:text-base border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary" placeholder="Search by employee name...">
                            </div>
                        </div>
                        
                        ${pendingRequests.length > 0
                    ? renderRequestsTable(pendingRequests) // Show table/cards if there are requests
                    : renderEmpty()                        // Show empty message if there are no requests
                }
                    </div>
                </main>

                <!-- Approval/rejection modal - Optimized for mobile -->
                <div id="approval-modal" class="fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50 hidden p-2 sm:p-4">
                    <div class="bg-background-primary p-4 sm:p-6 rounded-xl shadow-special border border-border-color w-full max-w-sm sm:max-w-md mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto">
                        <!-- Modal header -->
                        <div class="flex justify-between items-center mb-4">
                            <h3 id="modal-title" class="text-base sm:text-lg font-semibold text-text-primary"></h3>
                            <button id="close-modal" class="text-text-secondary hover:text-text-primary p-1">
                                <i class="fa-solid fa-times text-lg"></i>
                            </button>
                        </div>
                        <!-- Modal content -->
                        <div class="space-y-4">
                            <!-- Request summary -->
                            <div id="request-summary" class="bg-background-secondary p-3 rounded-lg text-xs sm:text-sm"></div>
                            <!-- Mandatory comments field -->
                            <div>
                                <label class="block text-xs sm:text-sm font-medium text-text-secondary mb-2">
                                    Comments <span id="comment-requirement" class="text-danger">*</span>
                                </label>
                                <textarea 
                                    id="approval-comments" 
                                    rows="3" 
                                    class="w-full px-3 py-2 text-sm border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary resize-none"
                                    placeholder="Add comments about this decision..."
                                ></textarea>
                                <p class="text-xs text-text-secondary mt-1">Comments are required for approval decisions</p>
                            </div>
                            <!-- Action buttons -->
                            <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
                                <button id="cancel-approval" class="w-full sm:w-auto px-4 py-2 border border-border-color rounded-lg text-text-secondary hover:bg-background-secondary transition-colors text-sm order-2 sm:order-1">
                                    Cancel
                                </button>
                                <button id="confirm-approval" class="w-full sm:w-auto px-4 py-2 rounded-lg text-white font-medium transition-colors text-sm order-1 sm:order-2">
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Add event listeners after rendering
            addEventListeners();
        } catch (error) {
            // Show error message if loading fails
            container.innerHTML = `
                <div class="p-3 sm:p-6">
                    <div class="bg-danger/10 text-danger p-4 rounded-lg">
                        <h3 class="font-semibold text-sm sm:text-base">Loading Error</h3>
                        <p class="text-sm sm:text-base">${error.message}</p>
                        <button class="bg-primary text-white px-4 py-2 rounded-lg mt-2 hover:bg-primary-hover transition-colors text-sm" onclick="window.location.reload()">Retry</button>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Function that renders the requests in table (desktop) and cards (mobile) format
     * @param {Array} requests - Array of pending request objects
     * @returns {string} HTML string with the rendered table and cards
     */
    function renderRequestsTable(requests) {
        // Card view for mobiles - each request is an individual card
        const mobileCards = requests
            .map((req) => {
                // Format request data
                const requestDate = new Date(req.created_at).toLocaleDateString();
                const employeeName = `${req.first_name} ${req.last_name}`;
                const department = req.department_name || "N/A";
                const manager = req.manager_name || "N/A";

                return `
                <div class="mobile-card bg-background-secondary p-4 rounded-lg border border-border-color space-y-3" data-employee="${employeeName.toLowerCase()}" data-type="${req.request_type.toLowerCase()}">
                    <!-- Card header with name and status -->
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="font-medium text-text-primary text-sm">${employeeName}</h3>
                            <p class="text-xs text-text-secondary">${department}</p>
                        </div>
                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-warning/10 text-yellow-600">
                            ${req.status_name || "Pending"}
                        </span>
                    </div>
                    <!-- Grid with request information -->
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <span class="text-text-secondary">Date:</span>
                            <span class="text-text-primary ml-1">${requestDate}</span>
                        </div>
                        <div>
                            <span class="text-text-secondary">Type:</span>
                            <span class="text-text-primary ml-1 capitalize">${req.request_type}</span>
                        </div>
                        <div class="col-span-2">
                            <span class="text-text-secondary">Manager:</span>
                            <span class="text-text-primary ml-1">${manager}</span>
                        </div>
                    </div>
                    <!-- Action buttons -->
                    <div class="flex flex-col gap-2">
                        <!-- Button to view full details -->
                        <button 
                            class="view-details-btn w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center justify-center" 
                            data-request='${JSON.stringify(req).replace(/'/g, "&apos;")}'>
                            <i class="fa-solid fa-eye mr-1"></i>View Details
                        </button>
                        <!-- Approval/rejection buttons -->
                        <div class="flex gap-2">
                            <button 
                                class="approve-btn flex-1 bg-primary text-white px-3 py-2 rounded-md hover:bg-primary-hover transition-colors text-xs font-medium" 
                                data-id="${req.id}" 
                                data-employee="${employeeName}"
                                data-type="${req.request_type}"
                                data-request='${JSON.stringify(req).replace(/'/g, "&apos;")}'>
                                <i class="fa-solid fa-check mr-1"></i>Approve
                            </button>
                            <button 
                                class="reject-btn flex-1 bg-danger text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors text-xs font-medium" 
                                data-id="${req.id}"
                                data-employee="${employeeName}"
                                data-type="${req.request_type}"
                                data-request='${JSON.stringify(req).replace(/'/g, "&apos;")}'>
                                <i class="fa-solid fa-times mr-1"></i>Reject
                            </button>
                        </div>
                    </div>
                </div>
            `;
            })
            .join("");

        // Table view for desktop - traditional table rows
        const desktopRows = requests
            .map((req) => {
                // Format the same data for table view
                const requestDate = new Date(req.created_at).toLocaleDateString();
                const employeeName = `${req.first_name} ${req.last_name}`;
                const department = req.department_name || "N/A";
                const manager = req.manager_name || "N/A";

                return `
                <tr class="table-row hover:bg-background-secondary transition-colors" data-employee="${employeeName.toLowerCase()}" data-type="${req.request_type.toLowerCase()}">
                    <!-- Employee column -->
                    <td class="py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-text-primary">
                        <div class="truncate max-w-32 sm:max-w-none" title="${employeeName}">${employeeName}</div>
                    </td>
                    <!-- Date column -->
                    <td class="py-3 px-2 sm:px-4 text-xs sm:text-sm text-text-secondary">${requestDate}</td>
                    <!-- Status column -->
                    <td class="py-3 px-2 sm:px-4">
                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-warning/10 text-yellow-600">
                            ${req.status_name || "Pending"}
                        </span>
                    </td>
                    <!-- Request type column -->
                    <td class="py-3 px-2 sm:px-4 text-xs sm:text-sm text-text-secondary capitalize">
                        <div class="truncate max-w-20 sm:max-w-none" title="${req.request_type}">${req.request_type}</div>
                    </td>
                    <!-- Department column (hidden on small screens) -->
                    <td class="py-3 px-2 sm:px-4 text-xs sm:text-sm text-text-secondary hidden lg:table-cell">
                        <div class="truncate max-w-24" title="${department}">${department}</div>
                    </td>
                    <!-- Manager column (hidden on medium screens) -->
                    <td class="py-3 px-2 sm:px-4 text-xs sm:text-sm text-text-secondary hidden xl:table-cell">
                        <div class="truncate max-w-24" title="${manager}">${manager}</div>
                    </td>
                    <!-- Actions column with buttons -->
                    <td class="py-3 px-2 sm:px-4">
                        <div class="flex flex-col lg:flex-row gap-1 lg:gap-2">
                            <!-- Details button -->
                            <button 
                                class="view-details-btn bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs font-medium transition-colors flex items-center justify-center min-w-0" 
                                data-request='${JSON.stringify(req).replace(/'/g, "&apos;")}'>
                                <i class="fa-solid fa-eye lg:mr-1"></i>
                                <span class="hidden lg:inline">Details</span>
                            </button>
                            <!-- Approval/rejection buttons -->
                            <div class="flex gap-1">
                                <button 
                                    class="approve-btn bg-primary text-white px-2 sm:px-3 py-1 rounded-md hover:bg-primary-hover transition-colors text-xs font-medium flex items-center justify-center flex-1 lg:flex-none" 
                                    data-id="${req.id}" 
                                    data-employee="${employeeName}"
                                    data-type="${req.request_type}"
                                    data-request='${JSON.stringify(req).replace(/'/g, "&apos;")}'>
                                    <i class="fa-solid fa-check lg:mr-1"></i>
                                    <span class="hidden lg:inline">Approve</span>
                                </button>
                                <button 
                                    class="reject-btn bg-danger text-white px-2 sm:px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-xs font-medium flex items-center justify-center flex-1 lg:flex-none" 
                                    data-id="${req.id}"
                                    data-employee="${employeeName}"
                                    data-type="${req.request_type}"
                                    data-request='${JSON.stringify(req).replace(/'/g, "&apos;")}'>
                                    <i class="fa-solid fa-times lg:mr-1"></i>
                                    <span class="hidden lg:inline">Reject</span>
                                </button>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
            })
            .join("");

        // Return HTML that combines mobile and desktop view
        return `
            <!-- Mobile card view -->
            <div id="mobile-cards-container" class="block sm:hidden space-y-3">
                ${requests.length > 0 ? mobileCards : ""}
            </div>

            <!-- Desktop table view -->
            <div id="desktop-table-container" class="hidden sm:block overflow-x-auto bg-background-primary rounded-lg border border-border-color">
                <table class="w-full text-left min-w-full">
                    <!-- Table header -->
                    <thead>
                        <tr class="border-b border-border-color bg-background-secondary">
                            <th class="py-3 px-2 sm:px-4 font-semibold text-text-secondary text-xs sm:text-sm">Employee</th>
                            <th class="py-3 px-2 sm:px-4 font-semibold text-text-secondary text-xs sm:text-sm">Date</th>
                            <th class="py-3 px-2 sm:px-4 font-semibold text-text-secondary text-xs sm:text-sm">Status</th>
                            <th class="py-3 px-2 sm:px-4 font-semibold text-text-secondary text-xs sm:text-sm">Type</th>
                            <th class="py-3 px-2 sm:px-4 font-semibold text-text-secondary text-xs sm:text-sm hidden lg:table-cell">Department</th>
                            <th class="py-3 px-2 sm:px-4 font-semibold text-text-secondary text-xs sm:text-sm hidden xl:table-cell">Manager</th>
                            <th class="py-3 px-2 sm:px-4 font-semibold text-text-secondary text-xs sm:text-sm text-center min-w-32">Actions</th>
                        </tr>
                    </thead>
                    <!-- Table body with request rows -->
                    <tbody id="requests-tbody">${desktopRows}</tbody>
                </table>
            </div>
            <!-- Total request counter -->
            <div class="mt-4 text-xs sm:text-sm text-text-secondary">
                <span id="total-count">Total: ${requests.length} pending requests</span>
            </div>
        `;
    }

    /**
     * Function that renders the empty state when there are no pending requests
     * @returns {string} HTML string with message and empty state icon
     */
    function renderEmpty() {
        return `
            <div class="text-center py-12 sm:py-16 border-2 border-dashed border-border-color rounded-lg">
                <i class="fa-solid fa-clipboard-check text-2xl sm:text-4xl text-text-muted mb-4"></i>
                <h3 class="font-semibold text-text-primary mb-2 text-sm sm:text-base">No Pending Requests</h3>
                <p class="text-text-secondary text-xs sm:text-sm">All requests have been processed.</p>
            </div>
        `;
    }

    /**
     * Function that adds all necessary event listeners for functionality
     * Includes filters, search, action buttons, and modals
     */
    function addEventListeners() {
        // Get DOM elements for filters and search
        const typeFilter = container.querySelector("#type-filter");
        const searchInput = container.querySelector("#search-input");
        const tbody = container.querySelector("#requests-tbody");
        const mobileContainer = container.querySelector("#mobile-cards-container");
        const totalCount = container.querySelector("#total-count");

        /**
         * Function that filters and searches requests based on selected criteria
         * Works for both mobile (cards) and desktop (table) views
         */
        function filterAndSearch() {
            const typeValue = typeFilter.value.toLowerCase();
            const searchValue = searchInput.value.toLowerCase().trim();

            let visibleCount = 0;
            let totalCount = 0;
            let tableRows = [];

            // Filter desktop table rows
            if (tbody) {
                tableRows = tbody.querySelectorAll(".table-row");
                totalCount = tableRows.length;

                tableRows.forEach((row) => {
                    // Get filter data from data attributes
                    const employeeName = row.dataset.employee || "";
                    const requestType = row.dataset.type || "";

                    // Check if it matches the filters
                    const matchesType = !typeValue || requestType === typeValue;
                    const matchesSearch = !searchValue || employeeName.includes(searchValue);

                    // Show/hide row based on filters
                    if (matchesType && matchesSearch) {
                        row.style.display = "";
                        visibleCount++;
                    } else {
                        row.style.display = "none";
                    }
                });
            }

            // Filter mobile cards with the same logic
            if (mobileContainer) {
                const mobileCards = mobileContainer.querySelectorAll(".mobile-card");
                // If there is no table, use cards for counting
                if (!tbody || tableRows.length === 0) {
                    totalCount = mobileCards.length;
                    visibleCount = 0;
                }

                mobileCards.forEach((card) => {
                    const employeeName = card.dataset.employee || "";
                    const requestType = card.dataset.type || "";

                    const matchesType = !typeValue || requestType === typeValue;
                    const matchesSearch = !searchValue || employeeName.includes(searchValue);

                    if (matchesType && matchesSearch) {
                        card.style.display = "";
                        // Only count cards if we are not counting table rows
                        if (!tbody || tableRows.length === 0) {
                            visibleCount++;
                        }
                    } else {
                        card.style.display = "none";
                    }
                });
            }

            // Update results counter
            const totalCountElement = container.querySelector("#total-count");
            if (totalCountElement) {
                totalCountElement.textContent = `Total: ${visibleCount} of ${totalCount} pending requests`;
            }
        }

        // Add listeners for filters (execute filtering in real time)
        typeFilter?.addEventListener("change", filterAndSearch);
        searchInput?.addEventListener("input", filterAndSearch);

        // Event delegation to handle clicks on buttons (works with filtered content)
        container.addEventListener("click", (e) => {
            // Handle "View details" buttons
            if (e.target.closest(".view-details-btn")) {
                const button = e.target.closest(".view-details-btn");
                // Parse request data from data attribute
                const requestData = JSON.parse(
                    button.dataset.request.replace(/&apos;/g, "'")
                );
                showRequestDetailsModal(requestData);
                return;
            }

            // Handle "Approve" buttons
            if (e.target.closest(".approve-btn")) {
                const button = e.target.closest(".approve-btn");
                const requestId = button.dataset.id;
                const employee = button.dataset.employee;
                const type = button.dataset.type;
                const requestData = JSON.parse(
                    button.dataset.request.replace(/&apos;/g, "'")
                );
                showApprovalModal(requestId, "approve", employee, type, requestData);
                return;
            }

            // Handle "Reject" buttons
            if (e.target.closest(".reject-btn")) {
                const button = e.target.closest(".reject-btn");
                const requestId = button.dataset.id;
                const employee = button.dataset.employee;
                const type = button.dataset.type;
                const requestData = JSON.parse(
                    button.dataset.request.replace(/&apos;/g, "'")
                );
                showApprovalModal(requestId, "reject", employee, type, requestData);
                return;
            }
        });

        // Event listeners for approval modal
        const modal = container.querySelector("#approval-modal");
        const closeBtn = container.querySelector("#close-modal");
        const cancelBtn = container.querySelector("#cancel-approval");
        const confirmBtn = container.querySelector("#confirm-approval");

        // Close modal with close and cancel buttons
        [closeBtn, cancelBtn].forEach((btn) => {
            btn?.addEventListener("click", () => {
                modal.classList.add("hidden");
                modal.classList.remove("flex");
            });
        });

        modal?.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.add("hidden");
                modal.classList.remove("flex");
            }
        });
    }

    /**
     * Function that shows a modal with all the details of a specific request
     * @param {Object} request - Object with the complete request data
     */
    function showRequestDetailsModal(request) {
        // Create modal dynamically
        const detailsModal = document.createElement("div");
        detailsModal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4";

        // Format basic data
        const submittedDate = new Date(request.created_at).toLocaleDateString();
        let startDate = "N/A";
        let endDate = "N/A";
        let comments = "";
        let reason = "";
        let daysRequested = null;
        let typeName = "";

        // Extract specific data based on request type
        if (request.request_type === "vacation") {
            startDate = request.vacation_start_date
                ? new Date(request.vacation_start_date).toLocaleDateString()
                : "N/A";
            endDate = request.vacation_end_date
                ? new Date(request.vacation_end_date).toLocaleDateString()
                : "N/A";
            comments = request.vacation_comments || "";
            daysRequested = request.days_requested;
            typeName = request.vacation_type_name || "";
        } else if (request.request_type === "leave") {
            startDate = request.leave_start_date
                ? new Date(request.leave_start_date).toLocaleDateString()
                : "N/A";
            endDate = request.leave_end_date
                ? new Date(request.leave_end_date).toLocaleDateString()
                : "N/A";
            reason = request.leave_reason || "";
            typeName = request.leave_type_name || "";
        } else if (request.request_type === "certificate") {
            comments = request.certificate_comments || "";
            typeName = request.certificate_type_name || "";
        }

        // Generate modal HTML with all detailed information
        detailsModal.innerHTML = `
            <div class="bg-background-primary p-4 sm:p-6 rounded-xl shadow-special border border-border-color w-full max-w-lg sm:max-w-2xl mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto">
                <!-- Details modal header -->
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-base sm:text-lg font-semibold text-text-primary">Request Details</h3>
                    <button class="close-details-modal text-text-secondary hover:text-text-primary p-1">
                        <i class="fa-solid fa-times text-lg"></i>
                    </button>
                </div>
                <!-- Grid with all information fields -->
                <div class="space-y-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <!-- Employee information -->
                        <div class="space-y-1">
                            <label class="block text-xs sm:text-sm font-medium text-text-secondary">Employee</label>
                            <p class="text-sm sm:text-base text-text-primary font-medium">${request.first_name} ${request.last_name}</p>
                        </div>
                        <!-- Request type -->
                        <div class="space-y-1">
                            <label class="block text-xs sm:text-sm font-medium text-text-secondary">Request Type</label>
                            <p class="text-sm sm:text-base text-text-primary capitalize">${request.request_type}</p>
                        </div>
                        <!-- Submission date -->
                        <div class="space-y-1">
                            <label class="block text-xs sm:text-sm font-medium text-text-secondary">Date Submitted</label>
                            <p class="text-sm sm:text-base text-text-primary">${submittedDate}</p>
                        </div>
                        <!-- Current status -->
                        <div class="space-y-1">
                            <label class="block text-xs sm:text-sm font-medium text-text-secondary">Current Status</label>
                            <span class="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-warning/10 text-yellow-600">
                                ${request.status_name || "Pending"}
                            </span>
                        </div>
                        <!-- Specific request type (if any) -->
                        ${typeName
                ? `
                        <div class="space-y-1 sm:col-span-2">
                            <label class="block text-xs sm:text-sm font-medium text-text-secondary">${request.request_type.charAt(0).toUpperCase() + request.request_type.slice(1)} Type</label>
                            <p class="text-sm sm:text-base text-text-primary">${typeName}</p>
                        </div>
                        `
                : ""
            }
                        <!-- Start date (if applies) -->
                        ${startDate !== "N/A"
                ? `
                        <div class="space-y-1">
                            <label class="block text-xs sm:text-sm font-medium text-text-secondary">Start Date</label>
                            <p class="text-sm sm:text-base text-text-primary">${startDate}</p>
                        </div>
                        `
                : ""
            }
                        <!-- End date (if applies) -->
                        ${endDate !== "N/A"
                ? `
                        <div class="space-y-1">
                            <label class="block text-xs sm:text-sm font-medium text-text-secondary">End Date</label>
                            <p class="text-sm sm:text-base text-text-primary">${endDate}</p>
                        </div>
                        `
                : ""
            }
                        <!-- Requested days (for vacations) -->
                        ${daysRequested
                ? `
                        <div class="space-y-1">
                            <label class="block text-xs sm:text-sm font-medium text-text-secondary">Days Requested</label>
                            <p class="text-sm sm:text-base text-text-primary">${daysRequested} day${daysRequested !== 1 ? "s" : ""}</p>
                        </div>
                        `
                : ""
            }
                        <!-- Employee's department -->
                        ${request.department_name
                ? `
                        <div class="space-y-1">
                            <label class="block text-xs sm:text-sm font-medium text-text-secondary">Department</label>
                            <p class="text-sm sm:text-base text-text-primary">${request.department_name}</p>
                        </div>
                        `
                : ""
            }
                        <!-- Employee's direct manager -->
                        ${request.manager_name
                ? `
                        <div class="space-y-1">
                            <label class="block text-xs sm:text-sm font-medium text-text-secondary">Direct Manager</label>
                            <p class="text-sm sm:text-base text-text-primary">${request.manager_name}</p>
                        </div>
                        `
                : ""
            }
                    </div>
                    <!-- Employee comments (if any) -->
                    ${comments
                ? `
                        <div class="space-y-2">
                            <label class="block text-xs sm:text-sm font-medium text-text-secondary">Employee Comments</label>
                            <p class="text-sm sm:text-base text-text-primary bg-background-secondary p-3 rounded-lg">${comments}</p>
                        </div>
                    `
                : ""
            }
                    <!-- Reason for the request (for leaves) -->
                    ${reason
                ? `
                        <div class="space-y-2">
                            <label class="block text-xs sm:text-sm font-medium text-text-secondary">Reason</label>
                            <p class="text-sm sm:text-base text-text-primary bg-background-secondary p-3 rounded-lg">${reason}</p>
                        </div>
                    `
                : ""
            }
                    <!-- Button to close the modal -->
                    <div class="flex justify-end pt-4">
                        <button class="close-details-modal bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors font-medium text-sm">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add the modal to the DOM
        document.body.appendChild(detailsModal);

        // Event listeners to close the details modal
        detailsModal.querySelectorAll(".close-details-modal").forEach((btn) => {
            btn.addEventListener("click", () => {
                document.body.removeChild(detailsModal);
            });
        });

        // Close modal when clicking on the background
        detailsModal.addEventListener("click", (e) => {
            if (e.target === detailsModal) {
                document.body.removeChild(detailsModal);
            }
        });
    }

    /**
     * Function that shows the confirmation modal to approve or reject a request
     * @param {string} requestId - Unique ID of the request
     * @param {string} action - Action to perform: "approve" or "reject"
     * @param {string} employeeName - Full name of the employee
     * @param {string} requestType - Type of request (vacation, leave, certificate)
     * @param {Object} requestData - Complete request data
     */
    function showApprovalModal(requestId, action, employeeName, requestType, requestData) {
        // Get elements of the existing modal
        const modal = container.querySelector("#approval-modal");
        const modalTitle = container.querySelector("#modal-title");
        const confirmBtn = container.querySelector("#confirm-approval");
        const commentsTextarea = container.querySelector("#approval-comments");
        const requestSummary = container.querySelector("#request-summary");
        const commentRequirement = container.querySelector("#comment-requirement");

        // Set appearance based on action (approve vs reject)
        const isApprove = action === "approve";
        modalTitle.textContent = `${isApprove ? "Approve" : "Reject"} Request`;
        confirmBtn.textContent = isApprove ? "Approve Request" : "Reject Request";
        confirmBtn.className = `w-full sm:w-auto px-4 py-2 rounded-lg text-white font-medium transition-colors text-sm order-1 sm:order-2 ${
            isApprove
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-danger hover:bg-red-600"
        }`;

        // Extract specific information based on request type
        let startDate = "N/A";
        let endDate = "N/A";
        let daysRequested = null;
        let typeName = "";

        if (requestType === "vacation") {
            startDate = requestData.vacation_start_date
                ? new Date(requestData.vacation_start_date).toLocaleDateString()
                : "N/A";
            endDate = requestData.vacation_end_date
                ? new Date(requestData.vacation_end_date).toLocaleDateString()
                : "N/A";
            daysRequested = requestData.days_requested;
            typeName = requestData.vacation_type_name || "";
        } else if (requestType === "leave") {
            startDate = requestData.leave_start_date
                ? new Date(requestData.leave_start_date).toLocaleDateString()
                : "N/A";
            endDate = requestData.leave_end_date
                ? new Date(requestData.leave_end_date).toLocaleDateString()
                : "N/A";
            typeName = requestData.leave_type_name || "";
        } else if (requestType === "certificate") {
            typeName = requestData.certificate_type_name || "";
        }

        // Generate request summary for the modal
        requestSummary.innerHTML = `
            <h4 class="font-medium text-text-primary mb-2 text-sm">Request Summary</h4>
            <div class="text-xs sm:text-sm space-y-1">
                <p><span class="text-text-secondary">Employee:</span> <span class="text-text-primary font-medium">${employeeName}</span></p>
                <p><span class="text-text-secondary">Type:</span> <span class="text-text-primary capitalize">${requestType}</span></p>
                ${typeName
                ? `<p><span class="text-text-secondary">${requestType.charAt(0).toUpperCase() + requestType.slice(1)} Type:</span> <span class="text-text-primary">${typeName}</span></p>`
                : ""
            }
                ${startDate !== "N/A" && endDate !== "N/A"
                ? `<p><span class="text-text-secondary">Period:</span> <span class="text-text-primary">${startDate} - ${endDate}</span></p>`
                : ""
            }
                ${daysRequested
                ? `<p><span class="text-text-secondary">Duration:</span> <span class="text-text-primary">${daysRequested} day${daysRequested !== 1 ? "s" : ""}</span></p>`
                : ""
            }
                ${requestData.department_name
                ? `<p><span class="text-text-secondary">Department:</span> <span class="text-text-primary">${requestData.department_name}</span></p>`
                : ""
            }
            </div>
        `;

        // Set up comments field
        commentRequirement.textContent = "*"; // Mark as mandatory
        commentsTextarea.placeholder = `Enter the reason for ${isApprove ? "approving" : "rejecting"} this request...`;
        // Show the modal
        modal.classList.remove("hidden");
        modal.classList.add("flex");
        // Show the modal
        modal.classList.remove("hidden");

        // Create new confirm button to avoid duplicate listeners
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

        // Event listener for the confirm button
        newConfirmBtn.addEventListener("click", async () => {
            const comments = commentsTextarea.value.trim();

            // Validate that comments have been entered (mandatory)
            if (!comments) {
                showNotification("Comments are required for approval decisions", "error");
                commentsTextarea.focus();
                return;
            }

            // Process the approval/rejection action
            await handleApprovalAction(requestId, action, comments, employeeName, requestType);
            modal.classList.add("hidden");
        });
    }

    /**
     * Asynchronous function that handles the action of approving or rejecting a request
     * @param {string} requestId - ID of the request to process
     * @param {string} action - Action: "approve" or "reject"
     * @param {string} comments - Manager's comments (mandatory)
     * @param {string} employeeName - Employee's name for notifications
     * @param {string} requestType - Request type for notifications
     */
    async function handleApprovalAction(requestId, action, comments, employeeName, requestType) {
        try {
            // Get current user (manager who is approving)
            const user = auth.getUser();
            
            // Find the ID of the status corresponding to the action
            const statusId = findStatusId(action);
            if (!statusId) {
                throw new Error(`Could not find status ID for action: ${action}`);
            }

            // Show loading indicator during processing
            const loadingDiv = document.createElement("div");
            loadingDiv.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
            loadingDiv.innerHTML = `
                <div class="bg-background-primary p-4 sm:p-6 rounded-xl shadow-special mx-4">
                    <div class="flex items-center space-x-3">
                        <div class="w-6 h-6 sm:w-8 sm:h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                        <span class="text-text-primary text-sm sm:text-base">Processing ${action}...</span>
                    </div>
                </div>
            `;
            document.body.appendChild(loadingDiv);

            // Send approval/rejection request to the backend
            await approveRequest(requestId, {
                approver_id: user.id,    // ID of the manager approving
                status_id: statusId,     // ID of the new status
                comments: comments,      // Manager's comments
            });

            // Remove loading indicator
            document.body.removeChild(loadingDiv);

            // Show success notification
            showNotification(
                `${requestType} request for ${employeeName} has been ${action}d successfully.`,
                "success"
            );

            // Reload the page to show updated changes
            await loadAndRender();
        } catch (error) {
            // Remove any loading indicator in case of error
            const loadingDivs = document.querySelectorAll(".fixed.inset-0");
            loadingDivs.forEach((div) => {
                if (div.innerHTML.includes("Processing") && div.parentNode) {
                    document.body.removeChild(div);
                }
            });

            // Show error notification
            showNotification(`Failed to ${action} request: ${error.message}`, "error");
        }
    }

    /**
     * Function that finds the ID of the status corresponding to an action
     * @param {string} action - Action: "approve" or "reject"
     * @returns {number|undefined} ID of the found status or undefined if it doesn't exist
     */
    function findStatusId(action) {
        // Mapping of actions to possible status names
        const statusNames = {
            approve: ["Approved", "approved"],
            reject: ["Rejected", "rejected", "Denied", "denied"],
        };

        const possibleNames = statusNames[action] || [];
        
        // Find status that matches any of the possible names
        const status = requestStatuses.find((s) =>
            possibleNames.some((name) => s.name.toLowerCase() === name.toLowerCase())
        );

        return status?.id;
    }

    /**
     * Function that shows temporary notifications in the top right corner
     * @param {string} message - Message to display
     * @param {string} type - Type of notification: "success", "error", or "info"
     */
    function showNotification(message, type = "info") {
        // Create notification element
        const notification = document.createElement("div");
        notification.className = `fixed top-4 right-2 sm:right-4 z-50 p-3 sm:p-4 rounded-lg shadow-lg max-w-72 sm:max-w-md transition-all duration-300 ${
            type === "success"
                ? "bg-success/10 text-green-600 border border-green-200"    // Green for success
                : type === "error"
                    ? "bg-danger/10 text-red-600 border border-red-200"     // Red for error
                    : "bg-primary/10 text-blue-600 border border-blue-200"  // Blue for info
        }`;

        // HTML of the notification with icon and close button
        notification.innerHTML = `
            <div class="flex items-start space-x-2">
                <!-- Icon according to the notification type -->
                <i class="fa-solid ${
                    type === "success"
                        ? "fa-check-circle"      // Check for success
                        : type === "error"
                            ? "fa-exclamation-circle"  // Exclamation for error
                            : "fa-info-circle"         // Info for general
                } mt-0.5 flex-shrink-0"></i>
                <!-- Notification message -->
                <span class="text-xs sm:text-sm font-medium flex-1 leading-relaxed">${message}</span>
                <!-- Button to close manually -->
                <button class="text-current hover:opacity-70 flex-shrink-0 p-1">
                    <i class="fa-solid fa-times text-xs"></i>
                </button>
            </div>
        `;

        // Add notification to the DOM
        document.body.appendChild(notification);

        // Auto-remove the notification after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = "translateX(100%)"; // Exit animation
                setTimeout(() => {
                    if (notification.parentNode) {
                        document.body.removeChild(notification);
                    }
                }, 300); // Time to complete the animation
            }
        }, 5000);

        // Event listener to manually close the notification
        notification.querySelector("button").addEventListener("click", () => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        });
    }

    // Start data loading and rendering when creating the page
    loadAndRender();
    
    // Return the container so it can be added to the main DOM
    return container;
}