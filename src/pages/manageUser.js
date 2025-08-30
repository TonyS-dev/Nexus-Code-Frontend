import { auth } from '../services/auth.service.js';
import { apiRequest } from '../services/api.service.js';
import { router } from '../router/router.js';

export async function showManageUsersPage() {
    const container = document.createElement('div');
    container.className = 'max-w-7xl mx-auto p-6';

    try {
        // Check authorization
        const user = auth.isAuthenticated() ? await auth.getUser() : null;
        if (!user) {
            setTimeout(() => router.navigate('/login'), 100);
            return container;
        }

        // Initial loading state
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center p-12">
                <div class="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p class="text-gray-600">Loading users...</p>
            </div>
        `;

        // Fetch users data
        const users = await apiRequest('/employees');
        
        // Render main interface
        container.innerHTML = `
            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                <div class="p-6 border-b border-gray-200">
                    <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h1 class="text-2xl font-bold text-gray-800">User Management</h1>
                        <div class="flex gap-4">
                            <input type="text" id="search-input" 
                                   class="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   placeholder="Search users...">
                            <button id="add-user-btn" 
                                    class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                </svg>
                                Add User
                            </button>
                        </div>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200" id="users-table-body">
                            ${users.map(user => `
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div>
                                                <div class="text-sm font-medium text-gray-900">
                                                    ${user.first_name} ${user.last_name}
                                                </div>
                                                <div class="text-sm text-gray-500">${user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="text-sm text-gray-900">${user.roles?.[0]?.name || 'No role'}</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                   ${user.employee_status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                            ${user.employee_status || 'Unknown'}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${user.headquarters_name || 'Not assigned'}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div class="flex justify-end gap-2">
                                            <button class="text-blue-600 hover:text-blue-900" data-action="edit" data-id="${user.id}">
                                                Edit
                                            </button>
                                            <button class="text-red-600 hover:text-red-900" data-action="delete" data-id="${user.id}">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Event Handlers
        const searchInput = container.querySelector('#search-input');
        searchInput?.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const rows = container.querySelectorAll('#users-table-body tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });

        container.querySelector('#add-user-btn')?.addEventListener('click', () => {
            router.navigate('/add-user');
        });

        container.addEventListener('click', async (e) => {
            const target = e.target.closest('[data-action]');
            if (!target) return;

            const action = target.dataset.action;
            const userId = target.dataset.id;

            if (action === 'edit') {
                router.navigate(`/edit-employee/${userId}`);
            } else if (action === 'delete') {
                if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
                    try {
                        await apiRequest(`/employees/${userId}`, 'DELETE');
                        target.closest('tr').remove();
                        alert('User deleted successfully');
                    } catch (error) {
                        alert('Error deleting user: ' + error.message);
                    }
                }
            }
        });

    } catch (error) {
        console.error('Error in showManageUsersPage:', error);
        container.innerHTML = `
            <div class="bg-red-100 border border-red-400 text-red-700 p-6 rounded-lg">
                <h3 class="text-lg font-semibold">Error</h3>
                <p>${error.message || 'An error occurred while loading users'}</p>
                <button class="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700" 
                        onclick="window.location.reload()">Try Again</button>
            </div>
        `;
    }

    return container;
}
