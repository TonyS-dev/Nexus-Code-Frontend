/**
 * @file Dashboard.js
 * @description Renders the main dashboard view with dynamic user data.
 */
import { auth } from '../services/auth.service.js';
import { getVacationBalance } from '../services/api.service.js';

export function showDashboardPage() {
    const user = auth.getUser();
    const container = document.createElement('div');
    // Using Tailwind classes for layout and styling
    container.className = 'w-full h-full flex flex-col';

    // Initial loading state
    container.innerHTML = `
        <main class="flex-1 p-6 overflow-y-auto">
            <h2 class="text-xl font-semibold text-text-primary mb-6">Your Summary</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Loading Skeletons -->
                <div class="bg-background-primary p-5 rounded-xl shadow-md animate-pulse h-24"></div>
                <div class="bg-background-primary p-5 rounded-xl shadow-md animate-pulse h-24"></div>
            </div>
        </main>
    `;

    async function loadDashboardData() {
        try {
            const balanceData = await getVacationBalance(user.id);
            const currentYearBalance = balanceData.find(
                (b) => b.year === new Date().getFullYear()
            ) || { available_days: 0, days_taken: 0 };
            const remainingDays =
                currentYearBalance.available_days -
                currentYearBalance.days_taken;

            // Re-render the content with the fetched data
            const content = container.querySelector('main');
            content.innerHTML = `
                <h2 class="text-xl font-semibold text-text-primary mb-6">Your Summary</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Vacation Card -->
                    <div class="bg-background-primary p-5 rounded-xl shadow-special border border-border-color flex items-center gap-4">
                        <div class="bg-sky-100 text-primary p-3 rounded-lg">
                            <i class="fa-solid fa-plane-departure text-2xl"></i>
                        </div>
                        <div>
                            <p class="text-sm font-semibold text-text-secondary">Vacation Days Left (${new Date().getFullYear()})</p>
                            <p class="text-3xl font-bold text-text-primary">${remainingDays}</p>
                        </div>
                    </div>
                    <!-- Requests Card (Placeholder) -->
                    <div class="bg-background-primary p-5 rounded-xl shadow-special border border-border-color flex items-center gap-4">
                         <div class="bg-teal-100 text-accent p-3 rounded-lg">
                            <i class="fa-solid fa-calendar-check text-2xl"></i>
                         </div>
                         <div>
                            <p class="text-sm font-semibold text-text-secondary">Requests Submitted</p>
                            <p class="text-3xl font-bold text-text-primary">--</p>
                         </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            container.querySelector(
                'main'
            ).innerHTML = `<div class="bg-danger/10 text-danger p-4 rounded-lg">Could not load dashboard data: ${error.message}</div>`;
        }
    }

    loadDashboardData();
    return container;
}
