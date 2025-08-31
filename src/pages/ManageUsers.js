import { auth } from '../services/auth.service.js';
import { apiRequest, deleteEmployee } from '../services/api.service.js';
import { router } from '../router/router.js';
import { getUserAccessLevel } from '../utils/helpers.js';

export async function showManageUsersPage() {
    try {
        const user = auth.isAuthenticated() ? await auth.getUser() : null;

        if (!user) {
            router.navigate('/login');
            return document.createElement('div');
        }

        const userAccessLevel = getUserAccessLevel(user);

        // Check access level for permissions - Admin access level can manage users
        if (userAccessLevel.toLowerCase() !== 'admin') {
            router.navigate('/forbidden');
            return document.createElement('div');
        }
    } catch (error) {
        console.error('Authorization error:', error);
        router.navigate('/login');
        return document.createElement('div');
    }

    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col';

    try {
        // Enhanced loading skeleton
        container.innerHTML = `
            <main class="flex-1 p-6 overflow-y-auto animate-fadeIn">
                <div class="bg-background-primary p-6 rounded-xl shadow-special border border-border-color">
                    <!-- Header Skeleton -->
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <div class="skeleton skeleton-text skeleton-title"></div>
                        <div class="skeleton skeleton-button mt-4 sm:mt-0"></div>
                    </div>
                    
                    <!-- Filters Skeleton -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                            <div class="skeleton skeleton-text" style="width: 30%; height: 14px; margin-bottom: 8px;"></div>
                            <div class="skeleton" style="height: 40px; border-radius: 8px;"></div>
                        </div>
                        <div>
                            <div class="skeleton skeleton-text" style="width: 20%; height: 14px; margin-bottom: 8px;"></div>
                            <div class="skeleton" style="height: 40px; border-radius: 8px;"></div>
                        </div>
                    </div>
                    
                    <!-- Table Skeleton -->
                    <div class="overflow-x-auto bg-background-primary rounded-lg border border-border-color">
                        <table class="w-full text-left">
                            <thead>
                                <tr class="border-b border-border-color bg-background-secondary">
                                    <th class="py-3 px-4"><div class="skeleton skeleton-text" style="width: 60px; height: 14px;"></div></th>
                                    <th class="py-3 px-4"><div class="skeleton skeleton-text" style="width: 40px; height: 14px;"></div></th>
                                    <th class="py-3 px-4"><div class="skeleton skeleton-text" style="width: 30px; height: 14px;"></div></th>
                                    <th class="py-3 px-4"><div class="skeleton skeleton-text" style="width: 35px; height: 14px;"></div></th>
                                    <th class="py-3 px-4"><div class="skeleton skeleton-text" style="width: 50px; height: 14px;"></div></th>
                                </tr>
                            </thead>
                            <tbody>
                                ${Array.from({ length: 5 }, (_, i) => `
                                    <tr class="border-b border-border-color animate-stagger-${(i % 4) + 1}">
                                        <td class="py-3 px-4"><div class="skeleton skeleton-text" style="width: 120px;"></div></td>
                                        <td class="py-3 px-4"><div class="skeleton skeleton-text" style="width: 160px;"></div></td>
                                        <td class="py-3 px-4"><div class="skeleton skeleton-button" style="width: 80px; height: 24px; border-radius: 12px;"></div></td>
                                        <td class="py-3 px-4"><div class="skeleton skeleton-text" style="width: 100px;"></div></td>
                                        <td class="py-3 px-4 text-right space-x-2">
                                            <div class="inline-block skeleton skeleton-button" style="width: 50px; height: 28px; margin-right: 8px;"></div>
                                            <div class="inline-block skeleton skeleton-button" style="width: 60px; height: 28px;"></div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Footer Skeleton -->
                    <div class="mt-4">
                        <div class="skeleton skeleton-text" style="width: 120px; height: 14px;"></div>
                    </div>
                </div>
            </main>
        `;

        // Fetch both employees and roles data
        const [employees, roles] = await Promise.all([
            apiRequest('/employees'),
            apiRequest('/roles')
        ]);

        if (!Array.isArray(employees)) {
            throw new Error('Invalid server response for employees.');
        }

        // Ensure roles is an array, fallback to empty array if not
        const safeRoles = Array.isArray(roles) ? roles : [];

        const rows = employees
            .map((emp, index) => {
                const fullName = `${emp.first_name || ''} ${
                    emp.last_name || ''
                }`.trim();
                // Converts roles array to string
                const rolesStr = Array.isArray(emp.roles)
                    ? emp.roles.join(', ')
                    : emp.roles || '';
                return `
                    <tr class="hover:bg-background-secondary transition-all duration-300 hover:shadow-sm hover-lift animate-fadeInUp animate-stagger-${(index % 4) + 1}">
                        <td class="py-3 px-4 text-sm font-medium text-text-primary">${fullName}</td>
                        <td class="py-3 px-4 text-sm text-text-secondary">${emp.email || ''}</td>
                        <td class="py-3 px-4">
                            <span class="px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary animate-scaleIn">
                                ${rolesStr}
                            </span>
                        </td>
                        <td class="py-3 px-4 text-sm text-text-secondary">${emp.headquarters_name || ''}</td>
                        <td class="py-3 px-4 text-right space-x-2">
                            <button class="bg-primary text-white px-3 py-1 rounded-md hover:bg-primary-hover transition-all duration-300 text-sm font-medium btn-edit btn-animated hover-scale" data-id="${emp.id}" title="Edit user">
                                <i class="fa-solid fa-edit mr-1"></i>Edit
                            </button>
                            <button class="bg-danger text-white px-3 py-1 rounded-md hover:bg-red-600 transition-all duration-300 text-sm font-medium btn-delete btn-animated hover-scale" data-id="${emp.id}" data-name="${fullName}" title="Delete user">
                                <i class="fa-solid fa-trash mr-1"></i>Delete
                            </button>
                        </td>
                    </tr>`;
            })
            .join('');

        // Generate role options dynamically
        const roleOptions = safeRoles
            .map(role => `<option value="${role.name.toLowerCase()}">${role.name}</option>`)
            .join('');

        container.innerHTML = `
            <main class="flex-1 p-6 overflow-y-auto animate-fadeIn">
                <div class="bg-background-primary p-6 rounded-xl shadow-special border border-border-color hover-glow transition-all duration-500">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 animate-fadeInUp">
                        <h2 class="text-xl font-semibold text-text-primary">Manage Users</h2>
                        <button id="new-employee-btn" class="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-hover transition-all duration-300 mt-4 sm:mt-0 btn-animated hover-lift">
                            <i class="fa-solid fa-plus mr-2"></i>New Employee
                        </button>
                    </div>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 animate-fadeInUp animate-stagger-1">
                        <div class="form-group">
                            <label for="roles-filter" class="block text-sm font-medium text-text-secondary mb-2">Filter by role:</label>
                            <select id="roles-filter" class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary transition-all duration-300 hover:border-primary/50">
                                <option value="">All Roles</option>
                                ${roleOptions}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="search-input" class="block text-sm font-medium text-text-secondary mb-2">Search:</label>
                            <input type="text" id="search-input" class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary transition-all duration-300 hover:border-primary/50" placeholder="Search by name or email...">
                        </div>
                    </div>
                    
                    <div class="overflow-x-auto bg-background-primary rounded-lg border border-border-color animate-fadeInUp animate-stagger-2">
                        <table class="w-full text-left">
                            <thead>
                                <tr class="border-b border-border-color bg-background-secondary">
                                    <th class="py-3 px-4 font-semibold text-text-secondary text-sm">Name</th>
                                    <th class="py-3 px-4 font-semibold text-text-secondary text-sm">Email</th>
                                    <th class="py-3 px-4 font-semibold text-text-secondary text-sm">Role</th>
                                    <th class="py-3 px-4 font-semibold text-text-secondary text-sm">Area</th>
                                    <th class="py-3 px-4 font-semibold text-text-secondary text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="users-tbody">${rows}</tbody>
                        </table>
                    </div>
                    
                    <div class="mt-4 text-sm text-text-secondary animate-fadeInUp animate-stagger-3">
                        <span id="total-count">Total: ${employees.length} users</span>
                    </div>
                </div>
            </main>
        `;

        function attachEventListeners() {
            container.querySelectorAll('.btn-edit').forEach((btn) => {
                btn.addEventListener('click', (e) =>
                    router.navigate(
                        `/edit-employee/${e.currentTarget.dataset.id}`
                    )
                );
            });
            
            container.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', async e => {
                    const button = e.currentTarget;
                    const employeeName = button.dataset.name;
                    const employeeId = button.dataset.id;
                    
                    if (confirm(`Are you sure you want to delete ${employeeName}?`)) {
                        try {
                            // Disable button and show loading state
                            button.disabled = true;
                            const originalText = button.innerHTML;
                            button.innerHTML = '<span class="text-xs">Deleting...</span>';
                            button.classList.add('opacity-50', 'cursor-not-allowed');
                            
                            // Call soft delete API
                            await deleteEmployee(employeeId);
                            
                            // Remove row from table
                            button.closest('tr').remove();
                            
                            // Update total count
                            const currentRows = container.querySelectorAll('#users-tbody tr').length;
                            container.querySelector('#total-count').textContent = `Total: ${currentRows} users`;
                            
                            // Show success message (simple alert for now)
                            alert(`${employeeName} has been successfully deleted.`);
                            
                        } catch (error) {
                            console.error('Error deleting employee:', error);
                            
                            // Reset button state
                            button.disabled = false;
                            button.innerHTML = originalText;
                            button.classList.remove('opacity-50', 'cursor-not-allowed');
                            
                            // Show error message
                            alert(`Error deleting ${employeeName}`);
                        }
                    }
                });
            });
        }

        container
            .querySelector('#new-employee-btn')
            ?.addEventListener('click', () => router.navigate('/new-employee'));

        // Add filter and search functionality
        const roleFilter = container.querySelector('#roles-filter');
        const searchInput = container.querySelector('#search-input');
        const tbody = container.querySelector('#users-tbody');
        const totalCount = container.querySelector('#total-count');

        function filterAndSearch() {
            const roleValue = roleFilter.value.toLowerCase();
            const searchValue = searchInput.value.toLowerCase().trim();
            const rows = tbody.querySelectorAll('tr');
            let visibleCount = 0;

            rows.forEach((row) => {
                const cells = row.querySelectorAll('td');
                if (cells.length < 3) return;

                const name = cells[0]?.textContent.toLowerCase().trim() || '';
                const email = cells[1]?.textContent.toLowerCase().trim() || '';
                const roleElement = cells[2]?.querySelector('span');
                const role = roleElement?.textContent.toLowerCase().trim() || '';

                const matchesRole =
                    !roleValue ||
                    role === roleValue ||
                    role.includes(roleValue);
                const matchesSearch =
                    !searchValue ||
                    name.includes(searchValue) ||
                    email.includes(searchValue) ||
                    role.includes(searchValue);

                if (matchesRole && matchesSearch) {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });

            totalCount.textContent = `Total: ${visibleCount} of ${employees.length} users`;
        }

        roleFilter.addEventListener('change', filterAndSearch);
        searchInput.addEventListener('input', filterAndSearch);

        attachEventListeners();
    } catch (error) {
        container.innerHTML = `<div class="alert error"><h3>Loading Error</h3><p>${error.message}</p><button class="btn" onclick="window.location.reload()">Retry</button></div>`;
    }
    return container;
}
