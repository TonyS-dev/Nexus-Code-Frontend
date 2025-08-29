// frontend/src/views/employeeHistory.js
import { auth } from '../services/auth.service.js';
import { apiRequest } from '../services/api.service.js';

export function showEmployeeHistoryPage(params) {
    const container = document.createElement('div');
    container.className = 'content-section';
    container.innerHTML = `<div class="loading">Loading employee history...</div>`;

    async function loadHistory() {
        try {
            // Use the authenticated user's ID if no parameters are provided
            const employeeId = params?.id || auth.getUser()?.id;
            if (!employeeId) throw new Error('Employee ID not found.');

            // In the future, we would call a specific history endpoint
            // For now, reuse the one to get employee data
            const employee = await apiRequest(`/employees/${employeeId}`);

            if (!employee) {
                container.innerHTML = `<div class="alert error">Employee not found.</div>`;
                return;
            }

            // Logic to display the actual history
            container.innerHTML = `
                <div class="main-header">
                    <h1>History for ${employee.first_name} ${
                employee.last_name
            }</h1>
                </div>
                <div class="profile-card">
                    <h3>Personal Information</h3>
                    <p><strong>Email:</strong> ${employee.email}</p>
                    <p><strong>Role:</strong> ${
                        employee.roles.map((r) => r.name).join(', ') || 'N/A'
                    }</p>
                    <p><strong>Hire Date:</strong> ${new Date(
                        employee.hire_date
                    ).toLocaleDateString()}</p>
                </div>
                <!-- !TODO: show a table or timeline with data from the employee_histories table -->
            `;
        } catch (error) {
            container.innerHTML = `<div class="alert error">Error loading history: ${error.message}</div>`;
        }
    }

    loadHistory();
    return container;
}
