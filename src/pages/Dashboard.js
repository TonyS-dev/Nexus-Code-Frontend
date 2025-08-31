/**
 * @file Dashboard.js
 * @description Renders the main dashboard view with dynamic user data and FullCalendar.
 */
import { auth } from '../services/auth.service.js';
import {
    getVacationBalance,
    getRequestsByEmployeeId,
} from '../services/api.service.js';
import { renderCalendar } from '../components/Calendar.js';

export function showDashboardPage() {
    const user = auth.getUser();
    const container = document.createElement('div');
    // Use responsive padding for different screen sizes. The layout handles the scrolling.
    container.className = 'p-4 sm:p-6 lg:p-8';

    // Initial loading state (skeletons)
    container.innerHTML = `
        <h2 class="text-xl font-semibold text-text-primary mb-6">Your Summary</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-background-primary p-5 rounded-xl shadow-special border border-border-color animate-pulse h-24"></div>
            <div class="bg-background-primary p-5 rounded-xl shadow-special border border-border-color animate-pulse h-24"></div>
            <div class="bg-background-primary p-5 rounded-xl shadow-special border border-border-color animate-pulse h-24"></div>
        </div>
        <div class="mt-8 bg-background-primary p-6 rounded-xl shadow-special border border-border-color animate-pulse h-96"></div>
    `;

    async function loadDashboardData() {
        try {
            const [balanceData, requestsData] = await Promise.all([
                getVacationBalance(user.id),
                getRequestsByEmployeeId(user.id),
            ]);

            const currentYearBalance = balanceData.find(
                (b) => b.year === new Date().getFullYear()
            ) || { available_days: 0, days_taken: 0 };
            const remainingDays =
                currentYearBalance.available_days -
                currentYearBalance.days_taken;
            const totalRequests = requestsData.length;
            const pendingRequests = requestsData.filter(
                (req) => req.status_name && req.status_name.toLowerCase() === 'pending'
            ).length;

            // Re-render the container's content with fetched data
            container.innerHTML = `
                <h2 class="text-xl font-semibold text-text-primary mb-6">Your Summary</h2>
                
                <!-- Stats Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div class="bg-background-primary p-5 rounded-xl shadow-special border border-border-color flex items-center gap-4">
                        <div class="bg-sky-100 text-primary p-3 rounded-full flex-shrink-0">
                            <i class="fa-solid fa-plane-departure text-xl w-6 text-center"></i>
                        </div>
                        <div>
                            <p class="text-sm font-semibold text-text-secondary">Vacation Days Left</p>
                            <p class="text-2xl font-bold text-text-primary">${remainingDays}</p>
                        </div>
                    </div>
                    <div class="bg-background-primary p-5 rounded-xl shadow-special border border-border-color flex items-center gap-4">
                         <div class="bg-teal-100 text-accent p-3 rounded-full flex-shrink-0">
                            <i class="fa-solid fa-calendar-check text-xl w-6 text-center"></i>
                         </div>
                         <div>
                            <p class="text-sm font-semibold text-text-secondary">Total Requests</p>
                            <p class="text-2xl font-bold text-text-primary">${totalRequests}</p>
                         </div>
                    </div>
                    <div class="bg-background-primary p-5 rounded-xl shadow-special border border-border-color flex items-center gap-4">
                         <div class="bg-yellow-100 text-yellow-600 p-3 rounded-full flex-shrink-0">
                            <i class="fa-solid fa-clock text-xl w-6 text-center"></i>
                         </div>
                         <div>
                            <p class="text-sm font-semibold text-text-secondary">Pending Requests</p>
                            <p class="text-2xl font-bold text-text-primary">${pendingRequests}</p>
                         </div>
                    </div>
                </div>

                <!-- Main Content Area -->
                <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    <div class="xl:col-span-3 bg-background-primary rounded-xl shadow-special border border-border-color">
                        <div class="p-4 sm:p-6 border-b border-border-color">
                            <h3 class="text-lg font-semibold text-text-primary">Calendar</h3>
                        </div>
                        <div class="p-2 sm:p-4">
                            <div id="calendar-container"></div>
                        </div>
                    </div>

                    <div class="xl:col-span-1 bg-background-primary rounded-xl shadow-special border border-border-color flex flex-col" style="max-height: 720px;">
                        <div class="p-4 sm:p-6 border-b border-border-color flex-shrink-0">
                            <h3 class="text-lg font-semibold text-text-primary">Recent Activity</h3>
                        </div>
                        <div class="flex-1 overflow-y-auto">
                            <div class="p-4 sm:p-6 space-y-3">
                                ${
                                    requestsData.length > 0
                                        ? requestsData
                                              .slice(0, 10)
                                              .map(
                                                  (request) => `
                                    <div class="flex items-start gap-3 p-3 bg-background-secondary rounded-lg">
                                        <div class="w-3 h-3 rounded-full ${getStatusColor(
                                            request.status_name
                                        )} flex-shrink-0 mt-1.5"></div>
                                        <div class="flex-1 min-w-0">
                                            <div class="flex items-center justify-between mb-1">
                                                <p class="text-sm font-medium text-text-primary capitalize truncate">${
                                                    request.request_type
                                                }</p>
                                                <span class="text-xs px-2 py-0.5 rounded-full ${getStatusBadgeClass(
                                                    request.status_name
                                                )} flex-shrink-0">${
                                                      request.status_name
                                                  }</span>
                                            </div>
                                            <p class="text-xs text-text-secondary">${formatDate(
                                                request.created_at
                                            )}</p>
                                        </div>
                                    </div>
                                `
                                              )
                                              .join('')
                                        : `
                                    <div class="text-center py-8">
                                        <i class="fa-solid fa-calendar-xmark text-3xl text-text-muted mb-3"></i>
                                        <p class="text-sm text-text-secondary">No recent activity</p>
                                    </div>
                                `
                                }
                            </div>
                        </div>
                        ${
                            requestsData.length > 10
                                ? `
                            <div class="p-4 border-t border-border-color text-center flex-shrink-0">
                                <a href="/my-requests" data-navigo class="text-sm text-primary hover:text-primary-hover font-medium">
                                    View All Requests →
                                </a>
                            </div>
                        `
                                : ''
                        }
                    </div>
                </div>
            `;

            const calendarContainer =
                document.getElementById('calendar-container');
            if (calendarContainer) {
                const calendarEvents = requestsData.map((request) => {
                    let startDate, endDate;
                    if (
                        request.request_type === 'vacation' &&
                        request.vacation_start_date
                    ) {
                        startDate = request.vacation_start_date;
                        endDate = request.vacation_end_date;
                    } else if (
                        request.request_type === 'leave' &&
                        request.leave_start_date
                    ) {
                        startDate = request.leave_start_date;
                        endDate = request.leave_end_date;
                    } else {
                        startDate = request.created_at;
                        endDate = request.created_at;
                    }
                    return {
                        type: request.request_type,
                        start_date: startDate,
                        end_date: endDate,
                        status: request.status_name?.toLowerCase(),
                    };
                });
                renderCalendar(calendarContainer, calendarEvents);
            }
        } catch (error) {
            container.innerHTML = `<div class="bg-danger/10 text-danger p-4 rounded-lg">Could not load dashboard data: ${error.message}</div>`;
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 1) return 'Today';
        if (diffDays <= 2) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    }

    function getStatusColor(status) {
        const colors = {
            pending: 'bg-yellow-500',
            approved: 'bg-green-500',
            rejected: 'bg-red-500',
        };
        return colors[status?.toLowerCase()] || 'bg-gray-500';
    }

    function getStatusBadgeClass(status) {
        const classes = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
        };
        return classes[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    }

    loadDashboardData();
    return container;
}
