/**
 * @file NewRequest.js
 * @description Renders a dynamic form for creating new employee requests.
 */
import { auth } from '../services/auth.service.js';
import { router } from '../router/router.js';
import * as api from '../services/api.service.js';

export function showNewRequestPage() {
    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col';
    container.innerHTML = `
        <header class="bg-background-primary border-b border-border-color p-6 shadow-sm">
            <h1 class="text-2xl font-bold text-text-primary">Create a New Request</h1>
        </header>
        <main class="flex-1 p-6 overflow-y-auto">
            <form id="new-request-form" class="bg-background-primary p-8 rounded-xl shadow-special border border-border-color max-w-3xl mx-auto">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="md:col-span-2">
                        <label for="request-type" class="block text-sm font-semibold text-text-primary mb-2">Request Type</label>
                        <select id="request-type" class="w-full p-2 border border-border-color rounded-md bg-background-secondary focus:ring-2 focus:ring-primary focus:border-primary transition">
                            <option value="">-- Choose a type --</option>
                            <option value="vacation">Vacation</option>
                            <option value="leave">Leave / Permit</option>
                            <option value="certificate">Certificate</option>
                        </select>
                    </div>
                    <div id="dynamic-fields" class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"></div>
                </div>
                <div class="mt-8 pt-6 border-t border-border-color flex justify-end gap-4">
                    <button type="button" id="cancel-btn" class="bg-background-secondary text-text-secondary font-semibold py-2 px-4 rounded-lg hover:bg-border-color/50 transition-colors">Cancel</button>
                    <button type="submit" class="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50" disabled>Submit Request</button>
                </div>
                <p id="form-error" class="text-danger mt-4 text-sm" style="display: none;"></p>
            </form>
        </main>
    `;

    const requestTypeSelect = container.querySelector('#request-type');
    const dynamicFieldsContainer = container.querySelector(
        '#dynamic-form-fields'
    );
    const form = container.querySelector('#new-request-form');
    const submitButton = form.querySelector('button[type="submit"]');

    // Event listener to dynamically change the form based on request type
    requestTypeSelect.addEventListener('change', async (e) => {
        const type = e.target.value;
        dynamicFieldsContainer.innerHTML =
            '<div class="loading">Loading form...</div>';
        submitButton.disabled = true;

        if (type === 'vacation') {
            const vacationTypes = await api.getVacationTypes();
            renderVacationForm(dynamicFieldsContainer, vacationTypes);
        } else if (type === 'leave') {
            const leaveTypes = await api.getLeaveTypes();
            renderLeaveForm(dynamicFieldsContainer, leaveTypes);
        } else if (type === 'certificate') {
            const certificateTypes = await api.getCertificateTypes();
            renderCertificateForm(dynamicFieldsContainer, certificateTypes);
        } else {
            dynamicFieldsContainer.innerHTML = '';
        }
        submitButton.disabled = !type;
    });

    // Handle form submission
    form.addEventListener('submit', handleFormSubmit);

    return container;
}

// --- Form Rendering Functions ---

function renderVacationForm(container, types) {
    const options = types
        .map((t) => `<option value="${t.id}">${t.name}</option>`)
        .join('');
    container.innerHTML = `
        <div class="md:col-span-2">
            <label for="vacation-type" class="block text-sm font-semibold text-text-primary mb-2">Vacation Type</label>
            <select id="vacation-type" name="vacation_type_id" required class="w-full p-2 border border-border-color rounded-md bg-background-secondary focus:ring-2 focus:ring-primary focus:border-primary transition">${options}</select>
        </div>
        <div>
            <label for="start-date" class="block text-sm font-semibold text-text-primary mb-2">Start Date</label>
            <input type="date" id="start-date" name="start_date" required class="w-full p-2 border border-border-color rounded-md bg-background-secondary focus:ring-2 focus:ring-primary focus:border-primary transition" />
        </div>
        <div>
            <label for="end-date" class="block text-sm font-semibold text-text-primary mb-2">End Date</label>
            <input type="date" id="end-date" name="end_date" required class="w-full p-2 border border-border-color rounded-md bg-background-secondary focus:ring-2 focus:ring-primary focus:border-primary transition" />
        </div>
        <div class="md:col-span-2">
            <label for="comments" class="block text-sm font-semibold text-text-primary mb-2">Comments</label>
            <textarea id="comments" name="comments" class="w-full p-2 border border-border-color rounded-md bg-background-secondary focus:ring-2 focus:ring-primary focus:border-primary transition" rows="3"></textarea>
        </div>
    `;
}

function renderLeaveForm(container, types) {
    const options = types
        .map((t) => `<option value="${t.id}">${t.name}</option>`)
        .join('');
    container.innerHTML = `
        <div class="form-group">
            <label for="leave-type">2. Leave Type*</label>
            <select id="leave-type" name="leave_type_id" required>${options}</select>
        </div>
        <div class="form-group">
            <label for="start-date">Start Date & Time*</label>
            <input type="datetime-local" id="start-date" name="start_date" required />
        </div>
        <div class="form-group">
            <label for="end-date">End Date & Time*</label>
            <input type="datetime-local" id="end-date" name="end_date" required />
        </div>
        <div class="form-group full-width">
            <label for="reason">Reason*</label>
            <textarea id="reason" name="reason" required placeholder="e.g., Medical appointment"></textarea>
        </div>
    `;
}

function renderCertificateForm(container, types) {
    const options = types
        .map((t) => `<option value="${t.id}">${t.name}</option>`)
        .join('');
    container.innerHTML = `
        <div class="form-group">
            <label for="certificate-type">2. Certificate Type*</label>
            <select id="certificate-type" name="certificate_type_id" required>${options}</select>
        </div>
        <div class="form-group full-width">
            <label for="comments">Comments</label>
            <textarea id="comments" name="comments" placeholder="e.g., For a visa application"></textarea>
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

        // The backend expects a default pending status, which it should handle.
        // We do not send status_id from the frontend on creation.

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
