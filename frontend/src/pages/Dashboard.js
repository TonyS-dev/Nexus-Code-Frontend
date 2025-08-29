/**
 * @file Dashboard.js
 * @description Renders the main dashboard view with dynamic user data and FullCalendar.
 */
import { auth } from '../services/auth.service.js';
import { getVacationBalance, getRequestsByEmployeeId } from '../services/api.service.js';
import { renderCalendar } from '../components/Calendar.js';

export function showDashboardPage() {
    const user = auth.getUser();
    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col';

    // Initial loading state
    container.innerHTML = `
        <main class="flex-1 p-6 overflow-y-auto">
            <h2 class="text-xl font-semibold text-text-primary mb-6">Your Summary</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Loading Skeletons -->
                <div class="bg-background-primary p-5 rounded-xl shadow-md animate-pulse h-24"></div>
                <div class="bg-background-primary p-5 rounded-xl shadow-md animate-pulse h-24"></div>
                <div class="bg-background-primary p-5 rounded-xl shadow-md animate-pulse h-24"></div>
            </div>
            <div class="mt-8 bg-background-primary p-6 rounded-xl shadow-md animate-pulse h-96"></div>
        </main>
    `;

    async function loadDashboardData() {
        try {
            // Load both vacation balance and requests data
            const [balanceData, requestsData] = await Promise.all([
                getVacationBalance(user.id),
                getRequestsByEmployeeId(user.id)
            ]);

            const currentYearBalance = balanceData.find(
                (b) => b.year === new Date().getFullYear()
            ) || { available_days: 0, days_taken: 0 };
            const remainingDays =
                currentYearBalance.available_days -
                currentYearBalance.days_taken;

            // Count total requests
            const totalRequests = requestsData.length;

            // Count pending requests
            const pendingRequests = requestsData.filter(
                request => request.name && request.name.toLowerCase() === 'pending'
            ).length;

            // Re-render the content with the fetched data
            const content = container.querySelector('main');
            content.innerHTML = `
                <h2 class="text-xl font-semibold text-text-primary mb-6">Your Summary</h2>
                
                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                    <!-- Total Requests Card -->
                    <div class="bg-background-primary p-5 rounded-xl shadow-special border border-border-color flex items-center gap-4">
                         <div class="bg-teal-100 text-accent p-3 rounded-lg">
                            <i class="fa-solid fa-calendar-check text-2xl"></i>
                         </div>
                         <div>
                            <p class="text-sm font-semibold text-text-secondary">Total Requests</p>
                            <p class="text-3xl font-bold text-text-primary">${totalRequests}</p>
                         </div>
                    </div>
                    <!-- Pending Requests Card -->
                    <div class="bg-background-primary p-5 rounded-xl shadow-special border border-border-color flex items-center gap-4">
                         <div class="bg-yellow-100 text-yellow-600 p-3 rounded-lg">
                            <i class="fa-solid fa-clock text-2xl"></i>
                         </div>
                         <div>
                            <p class="text-sm font-semibold text-text-secondary">Pending Requests</p>
                            <p class="text-3xl font-bold text-text-primary">${pendingRequests}</p>
                         </div>
                    </div>
                </div>

                <!-- Calendar Section -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Calendar -->
                    <div class="lg:col-span-2 bg-background-primary p-6 rounded-xl shadow-special border border-border-color">
                        <h3 class="text-lg font-semibold text-text-primary mb-6">Calendar</h3>
                        <div id="calendar-container"></div>
                    </div>

                    <!-- Recent Activity -->
                    <div class="bg-background-primary p-6 rounded-xl shadow-special border border-border-color">
                        <h3 class="text-lg font-semibold text-text-primary mb-4">Recent Activity</h3>
                        <div id="recent-activity" class="space-y-3">
                            ${requestsData.slice(0, 5).map(request => `
                                <div class="flex items-center gap-3 p-3 bg-background-secondary rounded-lg">
                                    <div class="w-2 h-2 rounded-full ${getStatusColor(request.name)}"></div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-text-primary capitalize">${request.request_type}</p>
                                        <p class="text-xs text-text-secondary">${new Date(request.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <span class="text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(request.name)}">${request.name}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;

            // Use the existing FullCalendar component
            const calendarContainer = document.getElementById('calendar-container');
            if (calendarContainer) {
                // Transform requests data to calendar events format
                const calendarEvents = requestsData.map(request => ({
                    type: request.request_type,
                    start_date: request.created_at,
                    end_date: request.created_at, // Same day for most requests
                    status: request.name?.toLowerCase()
                }));
                
                renderCalendar(calendarContainer, calendarEvents);
            }
        } catch (error) {
            container.querySelector(
                'main'
            ).innerHTML = `<div class="bg-danger/10 text-danger p-4 rounded-lg">Could not load dashboard data: ${error.message}</div>`;
        }
    }

    // Helper functions for styling
    function getStatusColor(status) {
        const statusColors = {
            'pending': 'bg-yellow-500',
            'approved': 'bg-green-500',
            'rejected': 'bg-red-500',
            'cancelled': 'bg-gray-500'
        };
        return statusColors[status?.toLowerCase()] || 'bg-gray-500';
    }

    function getStatusBadgeClass(status) {
        const statusClasses = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'approved': 'bg-green-100 text-green-800', 
            'rejected': 'bg-red-100 text-red-800',
            'cancelled': 'bg-gray-100 text-gray-800'
        };
        return statusClasses[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    }

    loadDashboardData();
    return container;
}
