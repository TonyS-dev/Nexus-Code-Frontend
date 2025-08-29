/**
 * @file Dashboard.js
 * @description Renders the main dashboard view with dynamic user data.
 */
import { auth } from '../services/auth.service.js';
import { getVacationBalance } from '../services/api.service.js';

export function showDashboardPage() {
    const user = auth.getUser();
    const container = document.createElement('div');
    container.className = 'dashboard-container';

    // Initial loading state
    container.innerHTML = `
        <div class="main-header">
            <h1>Welcome, ${user.first_name}!</h1>
            <p>Loading your dashboard...</p>
        </div>
        <div class="dashboard-cards">
            <div class="summary-card">Loading...</div>
            <div class="summary-card">Loading...</div>
        </div>
    `;

    /**
     * Fetches dynamic data for the dashboard and re-renders the component.
     */
    async function loadDashboardData() {
        try {
            const balanceData = await getVacationBalance(user.id);
            // Assuming the API returns an array of balances, get the one for the current year.
            const currentYearBalance = balanceData.find(
                (b) => b.year === new Date().getFullYear()
            ) || { available_days: 0, days_taken: 0 };
            const remainingDays =
                currentYearBalance.available_days -
                currentYearBalance.days_taken;

            // Render the final content with fetched data.
            container.innerHTML = `
                <div class="main-header">
                    <h1>Welcome, ${user.first_name}!</h1>
                    <p>Here's a summary of your activity.</p>
                </div>
                <div class="dashboard-cards">
                    <div class="summary-card">
                         <div class="card-icon available"><i class="fa-solid fa-plane-departure"></i></div>
                         <div class="card-content">
                            <h3>Vacation Days Left (${new Date().getFullYear()})</h3>
                            <span class="days-count available">${remainingDays}</span>
                         </div>
                    </div>
                    <div class="summary-card">
                         <div class="card-icon used"><i class="fa-solid fa-calendar-check"></i></div>
                         <div class="card-content">
                            <h3>Requests Submitted</h3>
                            <span class="days-count">...</span> <!-- Placeholder for another metric -->
                         </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            container.querySelector(
                '.dashboard-cards'
            ).innerHTML = `<div class="alert error">Could not load dashboard data: ${error.message}</div>`;
        }
    }

    // Trigger the data loading process.
    loadDashboardData();

    return container;
}
