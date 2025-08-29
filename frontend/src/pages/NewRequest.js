/**
 * @file NewRequest.js
 * @description Renders a dynamic form for creating new employee requests.
 * Corrected for proper scrolling and styling.
 */
import { auth } from '../services/auth.service.js';
import { router } from '../router/router.js';
import * as api from '../services/api.service.js';

export function showNewRequestPage() {
    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col';

    container.innerHTML = `
        <main id="app-content" class="flex-1 p-6 lg:p-10">
            <div class="max-w-3xl mx-auto">
                <h2 class="text-xl font-semibold text-text-primary mb-6">Create a New Request</h2>
                <form id="new-request-form" class="bg-background-primary p-8 rounded-xl shadow-special">
                    <div class="grid grid-cols-1 gap-6">
                        <div>
                            <label for="request-type" class="block text-sm font-semibold text-text-secondary mb-2">Request Type</label>
                            <select id="request-type" class="w-full p-3 border border-border-color rounded-lg bg-background-secondary focus:ring-2 focus:ring-primary-color/50 focus:border-primary-color transition">
                                <option value="">-- Choose a type --</option>
                                <option value="vacation">Vacation</option>
                                <option value="leave">Leave / Permit</option>
                                <option value="certificate">Certificate</option>
                            </select>
                        </div>
                        
                        <!-- Dynamic fields will be injected here -->

                        <div id="dynamic-fields" class="contents"></div>
                    </div>

                    <div class="mt-7 pt-6 border-t border-border-color flex justify-end gap-2">
                        <button type="button" id="cancel-btn" class="bg-gray-200 text-text-secondary font-semibold py-2 px-5 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                        <button type="submit" class="btn-primary py-1 px-5" disabled>Submit Request</button>
                    </div>
                    <p id="form-error" class="text-danger-color mt-4 text-sm" style="display: none;"></p>
                </form>
            </div>
        </main>
    `;

    // --- LOGIC ---

    const requestTypeSelect = container.querySelector('#request-type');
    const dynamicFieldsContainer = container.querySelector('#dynamic-fields');
    const form = container.querySelector('#new-request-form');
    const submitButton = form.querySelector('button[type="submit"]');

    requestTypeSelect.addEventListener('change', async (e) => {
        const type = e.target.value;
        dynamicFieldsContainer.innerHTML = `<div class="text-center text-text-muted p-4">Loading...</div>`;
        submitButton.disabled = true;
        try {
            if (type) {
                let formConfig;
                switch (type) {
                    case 'vacation':
                        const vacationTypes = await api.getVacationTypes();
                        formConfig = getVacationFormConfig(vacationTypes);
                        break;
                    case 'leave':
                        const leaveTypes = await api.getLeaveTypes();
                        formConfig = getLeaveFormConfig(leaveTypes);
                        break;
                    case 'certificate':
                        const certificateTypes = await api.getCertificateTypes();
                        formConfig = getCertificateFormConfig(certificateTypes);
                        break;
                    default:
                        throw new Error('Invalid request type');
                }
                renderDynamicForm(dynamicFieldsContainer, formConfig, type);
                submitButton.disabled = false;
            } else {
                dynamicFieldsContainer.innerHTML = '';
                submitButton.disabled = true;
            }
        } catch (error) {
            dynamicFieldsContainer.innerHTML = `<div class="text-danger-color text-sm p-4">Failed to load form fields: ${error.message}</div>`;
            submitButton.disabled = true;
        }
    });

    form.addEventListener('submit', handleFormSubmit);
    container
        .querySelector('#cancel-btn')
        .addEventListener('click', () => router.navigate('/my-requests'));

    return container;
}

// --- Form Configuration Functions ---

function getVacationFormConfig(vacationTypes) {
    return {
        fields: [
            {
                type: 'select',
                name: 'vacation_type_id',
                label: 'Vacation Type',
                required: true,
                options: vacationTypes
            },
            {
                type: 'date-range',
                name: 'date',
                label: 'Date',
                required: true
            },
            {
                type: 'textarea',
                name: 'comments',
                label: 'Comments',
                required: false,
                rows: 2,
                placeholder: 'Additional comments or notes...'
            }
        ]
    };
}

function getLeaveFormConfig(leaveTypes) {
    return {
        fields: [
            {
                type: 'select',
                name: 'leave_type_id',
                label: 'Leave Type',
                required: true,
                options: leaveTypes
            },
            {
                type: 'datetime-range',
                name: 'date',
                label: 'Date & Time',
                required: true
            },
            {
                type: 'textarea',
                name: 'reason',
                label: 'Reason',
                required: true,
                rows: 2,
                placeholder: 'e.g., Medical appointment'
            }
        ]
    };
}

function getCertificateFormConfig(certificateTypes) {
    return {
        fields: [
            {
                type: 'select',
                name: 'certificate_type_id',
                label: 'Certificate Type',
                required: true,
                options: certificateTypes
            },
            {
                type: 'textarea',
                name: 'comments',
                label: 'Comments',
                required: false,
                rows: 3,
                placeholder: 'Additional information or purpose...'
            }
        ]
    };
}

// --- Dynamic Form Rendering ---

function renderDynamicForm(container, formConfig, requestType) {
    if (!formConfig || !formConfig.fields) {
        container.innerHTML = '<div class="text-danger-color text-sm p-4">No form configuration available</div>';
        return;
    }

    const fieldsHtml = formConfig.fields.map(field => renderFormField(field)).join('');
    container.innerHTML = fieldsHtml;
}

function renderFormField(field) {
    const { type, name, label, required = false, options = [], placeholder = '', rows = 3 } = field;
    const requiredAttr = required ? 'required' : '';
    const requiredLabel = required ? '*' : '';

    switch (type) {
        case 'select':
            const selectOptions = options.map(opt => 
                `<option value="${opt.value || opt.id}">${opt.label || opt.name}</option>`
            ).join('');
            return `
                <div class="col-span-full">
                    <label for="${name}" class="block text-sm font-semibold text-text-secondary mb-2">${label}${requiredLabel}</label>
                    <select id="${name}" name="${name}" ${requiredAttr} class="w-full p-3 border border-border-color rounded-lg bg-background-secondary focus:ring-2 focus:ring-primary-color/50 focus:border-primary-color transition">
                        <option value="">-- Choose an option --</option>
                        ${selectOptions}
                    </select>
                </div>
            `;

        case 'date':
            return `
                <div class="col-span-full">
                    <label for="${name}" class="block text-sm font-semibold text-text-secondary mb-2">${label}${requiredLabel}</label>
                    <input type="date" id="${name}" name="${name}" ${requiredAttr} class="w-full p-3 border border-border-color rounded-lg bg-background-secondary focus:ring-2 focus:ring-primary-color/50 focus:border-primary-color transition" />
                </div>
            `;

        case 'datetime-local':
            return `
                <div class="col-span-full">
                    <label for="${name}" class="block text-sm font-semibold text-text-secondary mb-2">${label}${requiredLabel}</label>
                    <input type="datetime-local" id="${name}" name="${name}" ${requiredAttr} class="w-full p-3 border border-border-color rounded-lg bg-background-secondary focus:ring-2 focus:ring-primary-color/50 focus:border-primary-color transition" />
                </div>
            `;

        case 'date-range':
            return `
                <div class="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label for="${name}_start" class="block text-sm font-semibold text-text-secondary mb-2">Start ${label}${requiredLabel}</label>
                        <input type="date" id="${name}_start" name="${name}_start" ${requiredAttr} class="w-full p-3 border border-border-color rounded-lg bg-background-secondary focus:ring-2 focus:ring-primary-color/50 focus:border-primary-color transition" />
                    </div>
                    <div>
                        <label for="${name}_end" class="block text-sm font-semibold text-text-secondary mb-2">End ${label}${requiredLabel}</label>
                        <input type="date" id="${name}_end" name="${name}_end" ${requiredAttr} class="w-full p-3 border border-border-color rounded-lg bg-background-secondary focus:ring-2 focus:ring-primary-color/50 focus:border-primary-color transition" />
                    </div>
                </div>
            `;

        case 'datetime-range':
            return `
                <div class="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label for="${name}_start" class="block text-sm font-semibold text-text-secondary mb-2">Start ${label}${requiredLabel}</label>
                        <input type="datetime-local" id="${name}_start" name="${name}_start" ${requiredAttr} class="w-full p-3 border border-border-color rounded-lg bg-background-secondary focus:ring-2 focus:ring-primary-color/50 focus:border-primary-color transition" />
                    </div>
                    <div>
                        <label for="${name}_end" class="block text-sm font-semibold text-text-secondary mb-2">End ${label}${requiredLabel}</label>
                        <input type="datetime-local" id="${name}_end" name="${name}_end" ${requiredAttr} class="w-full p-3 border border-border-color rounded-lg bg-background-secondary focus:ring-2 focus:ring-primary-color/50 focus:border-primary-color transition" />
                    </div>
                </div>
            `;

        case 'textarea':
            return `
                <div class="col-span-full">
                    <label for="${name}" class="block text-sm font-semibold text-text-secondary mb-2">${label}${requiredLabel}</label>
                    <textarea id="${name}" name="${name}" ${requiredAttr} class="w-full p-3 border border-border-color rounded-lg bg-background-secondary focus:ring-2 focus:ring-primary-color/50 focus:border-primary-color transition" rows="${rows}" placeholder="${placeholder}"></textarea>
                </div>
            `;

        case 'text':
        case 'email':
        case 'number':
        default:
            return `
                <div class="col-span-full">
                    <label for="${name}" class="block text-sm font-semibold text-text-secondary mb-2">${label}${requiredLabel}</label>
                    <input type="${type}" id="${name}" name="${name}" ${requiredAttr} placeholder="${placeholder}" class="w-full p-3 border border-border-color rounded-lg bg-background-secondary focus:ring-2 focus:ring-primary-color/50 focus:border-primary-color transition" />
                </div>
            `;
    }
}

// --- Submission Logic ---
async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const errorElement = form.querySelector('#form-error');
    const submitButton = form.querySelector('button[type="submit"]');
    errorElement.style.display = 'none';
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const requestType = form.querySelector('#request-type').value;

    try {
        const user = auth.getUser();
        data.employee_id = user.id;

        // Handle range fields properly
        if (data.date_start && data.date_end) {
            data.start_date = data.date_start;
            data.end_date = data.date_end;
            delete data.date_start;
            delete data.date_end;
        }

        // Remove any empty or undefined fields
        Object.keys(data).forEach(key => {
            if (data[key] === '' || data[key] === undefined || data[key] === null) {
                delete data[key];
            }
        });

        // Add missing required fields based on request type
        // Get the pending status UUID dynamically
        let pendingStatusId;
        try {
            const statuses = await api.getRequestStatuses();
            const pendingStatus = statuses.find(status => status.name.toLowerCase() === 'pending');
            if (!pendingStatus) {
                throw new Error('Pending status not found');
            }
            pendingStatusId = pendingStatus.id;
        } catch (error) {
            throw new Error('Unable to determine request status. Please try again.');
        }

        switch (requestType) {
            case 'vacation':
                // Calculate days_requested from date range
                if (data.start_date && data.end_date) {
                    const startDate = new Date(data.start_date);
                    const endDate = new Date(data.end_date);
                    const timeDiff = endDate.getTime() - startDate.getTime();
                    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
                    data.days_requested = daysDiff;
                }
                data.status_id = pendingStatusId;
                break;
            case 'leave':
                data.status_id = pendingStatusId;
                break;
            case 'certificate':
                data.status_id = pendingStatusId;
                break;
        }

        // Use existing API methods for each request type
        switch (requestType) {
            case 'vacation':
                await api.createVacationRequest(data);
                break;
            case 'leave':
                await api.createLeaveRequest(data);
                break;
            case 'certificate':
                await api.createCertificateRequest(data);
                break;
            default:
                throw new Error('Invalid request type selected.');
        }

        alert('Request submitted successfully!');
        router.navigate('/my-requests');
    } catch (error) {
        // Try to get more detailed error information from the API response
        let errorMessage = 'Unknown error occurred';
        
        errorElement.textContent = `Error: ${errorMessage}`;
        errorElement.style.display = 'block';
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Request';
    }
}
