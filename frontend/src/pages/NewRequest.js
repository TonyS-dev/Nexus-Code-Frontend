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
            if (type === 'vacation') {
                const types = await api.getVacationTypes();
                renderVacationForm(dynamicFieldsContainer, types);
            } else if (type === 'leave') {
                const types = await api.getLeaveTypes();
                renderLeaveForm(dynamicFieldsContainer, types);
            } else if (type === 'certificate') {
                const types = await api.getCertificateTypes();
                renderCertificateForm(dynamicFieldsContainer, types);
            } else {
                dynamicFieldsContainer.innerHTML = '';
            }
            submitButton.disabled = !type;
        } catch (error) {
            dynamicFieldsContainer.innerHTML = `<div class="text-danger-color text-sm p-4">Failed to load form fields.</div>`;
        }
    });

    form.addEventListener('submit', handleFormSubmit);
    container
        .querySelector('#cancel-btn')
        .addEventListener('click', () => router.navigate('/my-requests'));

    return container;
}

// --- Form Rendering Functions ---

function renderVacationForm(container, types) {
    const options = types
        .map((t) => `<option value="${t.id}">${t.name}</option>`)
        .join('');

    container.innerHTML = `
        <div class="col-span-full">
            <label for="vacation-type" class="block text-sm font-semibold text-text-secondary mb-2">Vacation Type</label>
            <select id="vacation-type" name="vacation_type_id" required class="w-full p-3 border border-border-color rounded-lg bg-background-secondary focus:ring-2 focus:ring-primary-color/50 focus:border-primary-color transition">${options}</select>
        </div>
        <div class="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label for="start-date" class="block text-sm font-semibold text-text-secondary mb-2">Start Date</label>
                <input type="date" id="start-date" name="start_date" required class="w-full p-3 border border-border-color rounded-lg bg-background-secondary focus:ring-2 focus:ring-primary-color/50 focus:border-primary-color transition" />
            </div>
            <div>
                <label for="end-date" class="block text-sm font-semibold text-text-secondary mb-2">End Date</label>
                <input type="date" id="end-date" name="end_date" required class="w-full p-3 border border-border-color rounded-lg bg-background-secondary focus:ring-2 focus:ring-primary-color/50 focus:border-primary-color transition" />
            </div>
        </div>
        <div class="col-span-full">
            <label for="comments" class="block text-sm font-semibold text-text-secondary mb-2">Comments</label>
            <textarea id="comments" name="comments" class="w-full p-3 border border-border-color rounded-lg bg-background-secondary focus:ring-2 focus:ring-primary-color/50 focus:border-primary-color transition" rows="2"></textarea>
        </div>
    `;
}

function renderLeaveForm(container, types) {
    const options = types
        .map((t) => `<option value="${t.id}">${t.name}</option>`)
        .join('');
    container.innerHTML = `
        <div class="col-span-full">
            <label for="leave-type" class="block text-sm font-semibold text-text-secondary mb-2">Leave Type</label>
            <select id="leave-type" name="leave_type_id" required class="w-full p-3 border border-border-color rounded-lg bg-background-secondary focus:ring-2 focus:ring-primary-color/50 focus:border-primary-color transition">${options}</select>
        </div>

        <div class="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label for="start-date" class="block text-sm font-semibold text-text-secondary mb-2">Start Date & Time</label>
                <input type="datetime-local" id="start-date" name="start_date" required class="w-full p-3 border border-border-color rounded-lg bg-background-secondary focus:ring-2 focus:ring-primary-color/50 focus:border-primary-color transition" />
            </div>
            <div>
                <label for="end-date" class="block text-sm font-semibold text-text-secondary mb-2">End Date & Time</label>
                <input type="datetime-local" id="end-date" name="end_date" required class="w-full p-3 border border-border-color rounded-lg bg-background-secondary focus:ring-2 focus:ring-primary-color/50 focus:border-primary-color transition" />
            </div>
        </div>

        <div class="col-span-full">
            <label for="reason" class="block text-sm font-semibold text-text-secondary mb-2">Reason</label>
            <textarea id="reason" name="reason" required class="w-full p-3 border border-border-color rounded-lg bg-background-secondary focus:ring-2 focus:ring-primary-color/50 focus:border-primary-color transition" rows="2" placeholder="e.g., Medical appointment"></textarea>
        </div>
    `;
}

function renderCertificateForm(container, types) {
    const options = types
        .map((t) => `<option value="${t.id}">${t.name}</option>`)
        .join('');
    container.innerHTML = `
        <div class="col-span-full">
            <label for="certificate-type" class="block text-sm font-semibold text-text-secondary mb-2">Certificate Type</label>
            <select id="certificate-type" name="certificate_type_id" required class="w-full p-3 border border-border-color rounded-lg bg-background-secondary focus:ring-2 focus:ring-primary-color/50 focus:border-primary-color transition">${options}</select>
        </div>
        <div class="col-span-full">
            <label for="comments" class="block text-sm font-semibold text-text-secondary mb-2">Comments</label>
            <textarea id="comments" name="comments" class="w-full p-3 border border-border-color rounded-lg bg-background-secondary focus:ring-2 focus:ring-primary-color/50 focus:border-primary-color transition" rows="3"></textarea>
        </div>
    `;
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
        errorElement.textContent = `Error: ${error.message}`;
        errorElement.style.display = 'block';
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Request';
    }
}
