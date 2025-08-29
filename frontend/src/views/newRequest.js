// frontend/src/pages/newRequest.js
import { auth } from '../services/auth.js';
import { requestService } from '../services/requestService.js';
import { router } from '../router/router.js';

export function showNewRequestPage() {
    const container = document.createElement('div');
    container.className = 'content-section';

    // This view is simple and just renders the form directly.
    renderForm(container);
    setupEventListeners(container);

    return container;
}

function renderForm(container) {
    container.innerHTML = `
        <div class="main-header">
            <h1>New Request</h1>
            <button class="btn btn-secondary" data-action="back">Back to My Requests</button>
        </div>

        <form id="new-request-form" class="form-grid">
            <div class="form-group">
                <label for="request-type">Request Type *</label>
                <select id="request-type" required>
                    <option value="">Select...</option>
                    <option value="vacation">Vacation</option>
                    <option value="leave">Leave / Permit</option>
                    <option value="certificate">Certificate</option>
                </select>
            </div>

            <div class="form-group">
                <label for="start-date">Start Date *</label>
                <input type="date" id="start-date" required>
            </div>

            <div class="form-group">
                <label for="end-date">End Date *</label>
                <input type="date" id="end-date" required>
            </div>
            
            <div class="form-group full-width">
                <label for="comments">Comments (Optional)</label>
                <textarea id="comments" rows="4" placeholder="Additional details..."></textarea>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Submit Request</button>
            </div>
            <p id="form-error" class="error-message" style="display: none;"></p>
        </form>
    `;
}

function setupEventListeners(container) {
    const backButton = container.querySelector('[data-action="back"]');
    if(backButton){
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Back button clicked');
            router.navigate('/my-requests');
        });
    }else{
        console.warn('Back button not found');
    }
    
    const form = container.querySelector('#new-request-form');
    const errorElement = container.querySelector('#form-error');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorElement.style.display = 'none';

        try {
            const user = auth.getUser();
            const formData = {
                employee_id: user.id,
                request_type: container.querySelector('#request-type').value,
                start_date: container.querySelector('#start-date').value,
                end_date: container.querySelector('#end-date').value,
                comments: container.querySelector('#comments').value,
                // The backend will set the initial status
            };

            // Basic validation
            if (
                !formData.request_type ||
                !formData.start_date ||
                !formData.end_date
            ) {
                throw new Error('Please fill all required fields.');
            }
            if (new Date(formData.end_date) < new Date(formData.start_date)) {
                throw new Error('End date cannot be before the start date.');
            }

            // Use the centralized requestService to create the request
            await requestService.createRequest(formData);

            alert('Request submitted successfully!');
            router.navigate('/my-requests');
        } catch (error) {
            errorElement.textContent = error.message;
            errorElement.style.display = 'block';
        }
    });
}
