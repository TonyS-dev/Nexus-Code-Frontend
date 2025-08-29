/**
 * @file NewRequest.js
 * @description Renders a dynamic form for creating new employee requests.
 */
import { auth } from '../services/auth.service.js';
import { router } from '../router/router.js';
import * as api from '../services/api.service.js';

export function showNewRequestPage() {
    const container = document.createElement('div');
    container.className = 'new-request-container';
    container.innerHTML = `
        <div class="main-header">
            <h1>Create a New Request</h1>
        </div>
        <form id="new-request-form" class="form-grid content-section">
            <!-- Fields will be injected here -->
            <div class="form-group">
                <label for="request-type">1. Select Request Type*</label>
                <select id="request-type" required>
                    <option value="">--Please choose an option--</option>
                    <option value="vacation">Vacation</option>
                    <option value="leave">Leave / Permit</option>
                    <option value="certificate">Certificate</option>
                </select>
            </div>
            
            <div id="dynamic-form-fields"></div>

            <div class="form-actions full-width">
                <button type="submit" class="btn btn-primary" disabled>Submit Request</button>
            </div>
            <p id="form-error" class="error-message" style="display: none;"></p>
        </form>
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
        <div class="form-group">
            <label for="vacation-type">2. Vacation Type*</label>
            <select id="vacation-type" name="vacation_type_id" required>${options}</select>
        </div>
        <div class="form-group">
            <label for="start-date">Start Date*</label>
            <input type="date" id="start-date" name="start_date" required />
        </div>
        <div class="form-group">
            <label for="end-date">End Date*</label>
            <input type="date" id="end-date" name="end_date" required />
        </div>
        <div class="form-group full-width">
            <label for="comments">Comments</label>
            <textarea id="comments" name="comments" placeholder="e.g., Family trip"></textarea>
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
