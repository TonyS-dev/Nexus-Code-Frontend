import { auth } from '../services/auth.service.js';
import { apiRequest } from '../services/api.service.js';
import { router } from '../router/router.js';
import { getUserAccessLevel, formatDateForInput } from '../utils/helpers.js'

export async function showEditEmployeePage(params = {}) {
    const employeeId = params?.id;

    const container = document.createElement('div');
    container.className = 'max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg';

    if (!employeeId) {
        console.warn('No employee ID found');
        container.innerHTML = `
            <div class="bg-red-100 border border-red-400 text-red-700 p-6 rounded-lg mb-4">
                <h3 class="text-lg font-semibold">Error</h3>
                <p>No valid employee ID provided.</p>
                <button class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" onclick="window.history.back()">Back</button>
            </div>
        `;
        return container;
    }

    // Authorization check
    try {
        const user = auth.isAuthenticated() ? await auth.getUser() : null;
        console.log('Authenticated user:', user);

        if (!user) {
            setTimeout(() => router.navigate('/login'), 100);
            container.innerHTML = '<div class="text-center p-8">Redirecting...</div>';
            return container;
        }

        // Check if user has permission to edit employees
        const userAccessLevel = getUserAccessLevel(user);
        
        if (userAccessLevel.toLowerCase() !== 'admin') {
            console.log('Unauthorized access level, redirecting to /forbidden');
            setTimeout(() => router.navigate('/forbidden'), 100);
            container.innerHTML = '<div class="text-center p-8">Acceso denegado...</div>';
            return container;
        }
    } catch (error) {
        console.error('Authorization error:', error);
        setTimeout(() => router.navigate('/login'), 100);
        container.innerHTML = '<div class="text-center p-8">Error de autenticación...</div>';
        return container;
    }

    try {
        // Show loading state
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center p-12 text-center">
                <div class="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p class="text-gray-600">Cargando información del usuario...</p>
            </div>
        `;
        console.log('Loading state set');

        // Fetch all required data
        const [employee, roles, headquarters, genders, employeeStatuses, identificationTypes, accessLevels, managers] = await Promise.all([
            apiRequest(`/employees/${employeeId}`),
            apiRequest('/roles'),
            apiRequest('/headquarters'),
            apiRequest('/genders'),
            apiRequest('/employee-statuses'),
            apiRequest('/identification-types'),
            apiRequest('/access-levels'),
            apiRequest('/employees?role=Manager')
        ]);


        if (!employee) {
            throw new Error('User not found');
        }

        const user = auth.getUser();
        let currentRoleId = '';
        if (employee.roles && Array.isArray(employee.roles) && employee.roles.length > 0) {
            currentRoleId = employee.roles[0].id || '';
        }

        const userAccessLevel = getUserAccessLevel(user);
        const canEdit = userAccessLevel.toLowerCase() === 'admin';
        
        // Format dates for input fields
        const formattedBirthDate = formatDateForInput(employee.birth_date);
        const formattedHireDate = formatDateForInput(employee.hire_date);
        
        // Ensure all arrays are safe
        const safeGenders = Array.isArray(genders) ? genders : [];
        const safeIdentificationTypes = Array.isArray(identificationTypes) ? identificationTypes : [];
        const safeRoles = Array.isArray(roles) ? roles : [];
        const safeHeadquarters = Array.isArray(headquarters) ? headquarters : [];
        const safeEmployeeStatuses = Array.isArray(employeeStatuses) ? employeeStatuses : [];
        const safeAccessLevels = Array.isArray(accessLevels) ? accessLevels : [];
        const safeManagers = Array.isArray(managers) ? managers : [];

        // Render the form
        container.innerHTML = `
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b-2 border-gray-200">
                <h1 class="text-2xl font-bold text-gray-800">Edit User: ${employee.first_name || ''} ${employee.last_name || ''}</h1>
                <button class="btn-secondary mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors" id="back-btn">
                    <span class="text-xl">←</span> Back
                </button>
            </div>

            <form id="edit-employee-form" class="space-y-6">
                <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-700 mb-4 border-b-2 border-blue-600 pb-2">Personal Information</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label for="employee_code" class="block text-sm font-medium text-gray-700 required">Employee Code *</label>
                            <input type="text" id="employee_code" name="employee_code" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2" 
                                   placeholder="EMP001" maxlength="20" value="${employee.employee_code || ''}">
                        </div>
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 required">Email *</label>
                            <input type="email" id="email" name="email" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2" 
                                   placeholder="user@nexus.com" maxlength="60" value="${employee.email || ''}">
                        </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label for="first_name" class="block text-sm font-medium text-gray-700 required">First Name *</label>
                            <input type="text" id="first_name" name="first_name" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2" 
                                   maxlength="40" value="${employee.first_name || ''}">
                        </div>
                        <div>
                            <label for="middle_name" class="block text-sm font-medium text-gray-700">Middle Name</label>
                            <input type="text" id="middle_name" name="middle_name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2" 
                                   maxlength="40" value="${employee.middle_name || ''}">
                        </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label for="last_name" class="block text-sm font-medium text-gray-700 required">Last Name *</label>
                            <input type="text" id="last_name" name="last_name" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2" 
                                   maxlength="40" value="${employee.last_name || ''}">
                        </div>
                        <div>
                            <label for="second_last_name" class="block text-sm font-medium text-gray-700">Second Last Name</label>
                            <input type="text" id="second_last_name" name="second_last_name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2" 
                                   maxlength="40" value="${employee.second_last_name || ''}">
                        </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
                            <input type="tel" id="phone" name="phone" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2" 
                                   placeholder="+57 300 123 4567" maxlength="20" value="${employee.phone || ''}">
                        </div>
                        <div>
                            <label for="birth_date" class="block text-sm font-medium text-gray-700">Birth Date</label>
                            <input type="date" id="birth_date" name="birth_date" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2" 
                                   value="${formattedBirthDate}">
                        </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label for="gender_id" class="block text-sm font-medium text-gray-700">Gender</label>
                            <select id="gender_id" name="gender_id" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2">
                                <option value="">Select gender...</option>
                                ${safeGenders.map(g => `<option value="${g.id}" ${g.name === (employee.gender || '') ? 'selected' : ''}>${g.name || ''}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label for="identification_type_id" class="block text-sm font-medium text-gray-700">ID Type</label>
                            <select id="identification_type_id" name="identification_type_id" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2">
                                <option value="">Select type...</option>
                                ${safeIdentificationTypes.map(it => `<option value="${it.id}" ${it.name === (employee.identification_type || '') ? 'selected' : ''}>${it.name || ''}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label for="identification_number" class="block text-sm font-medium text-gray-700">ID Number</label>
                            <input type="text" id="identification_number" name="identification_number" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2" 
                                   placeholder="12345678" maxlength="50" value="${employee.identification_number || ''}">
                        </div>
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700">New Password (leave blank to keep current)</label>
                            <input type="password" id="password" name="password" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2" 
                                   placeholder="New password" minlength="6">
                        </div>
                    </div>
                </div>

                <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-700 mb-4 border-b-2 border-blue-600 pb-2">Job Information</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label for="hire_date" class="block text-sm font-medium text-gray-700 required">Hire Date *</label>
                            <input type="date" id="hire_date" name="hire_date" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2" 
                                   value="${formattedHireDate}">
                        </div>
                        <div>
                            <label for="role_id" class="block text-sm font-medium text-gray-700 required">Role *</label>
                            <select id="role_id" name="role_id" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2">
                                <option value="">Select role...</option>
                                ${safeRoles.map(r => `<option value="${r.id}" ${r.id === currentRoleId ? 'selected' : ''}>${r.name || ''}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label for="headquarters_id" class="block text-sm font-medium text-gray-700 required">Headquarters *</label>
                            <select id="headquarters_id" name="headquarters_id" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2">
                                <option value="">Select headquarters...</option>
                                ${safeHeadquarters.map(hq => `<option value="${hq.id}" ${hq.name === (employee.headquarters_name || '') ? 'selected' : ''}>${hq.name || ''}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label for="manager_id" class="block text-sm font-medium text-gray-700">Manager</label>
                            <select id="manager_id" name="manager_id" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2">
                                <option value="">No manager assigned...</option>
                                ${safeManagers.map(m => `<option value="${m.id}" ${m.id === (employee.manager_id || '') ? 'selected' : ''}>${m.first_name || ''} ${m.last_name || ''}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label for="status_id" class="block text-sm font-medium text-gray-700 required">Status *</label>
                            <select id="status_id" name="status_id" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2">
                                <option value="">Select status...</option>
                                ${safeEmployeeStatuses.map(es => `<option value="${es.id}" ${es.name === (employee.employee_status || '') ? 'selected' : ''}>${es.name || ''}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label for="access_level_id" class="block text-sm font-medium text-gray-700">Access Level</label>
                            <select id="access_level_id" name="access_level_id" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2">
                                <option value="">Select level...</option>
                                ${safeAccessLevels.map(al => `<option value="${al.id}" ${al.name === (employee.access_level || '') ? 'selected' : ''}>${al.name || ''}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                </div>

                <div class="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 class="text-lg font-semibold text-gray-700 mb-4 border-b-2 border-blue-600 pb-2">System Information</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Creation Date:</label>
                            <span class="block text-sm text-gray-600">${employee.created_at ? new Date(employee.created_at).toLocaleDateString('es-ES') : 'Not available'}</span>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Last Update:</label>
                            <span class="block text-sm text-gray-600">${employee.updated_at ? new Date(employee.updated_at).toLocaleDateString('es-ES') : 'Never'}</span>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Current Manager:</label>
                            <span class="block text-sm text-gray-600">${(employee.manager_first_name || '') && (employee.manager_last_name || '') ? `${employee.manager_first_name} ${employee.manager_last_name}` : 'No manager'}</span>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Current Status:</label>
                            <span class="inline-block px-2 py-1 text-xs font-medium text-white bg-green-500 rounded-full">${employee.employee_status || 'No status'}</span>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end gap-4 mt-6">
                    <button type="button" class="btn-secondary px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600" id="cancel-btn">Cancel</button>
                    ${canEdit ? `
                        <button type="submit" class="btn-primary px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2" id="update-btn">
                            <span class="btn-text">Update User</span>
                            <span class="btn-loading hidden">Updating...</span>
                        </button>
                    ` : ''}
                </div>
            </form>
        `;

        // Event listeners
        const form = container.querySelector('#edit-employee-form');
        const updateBtn = container.querySelector('#update-btn');
        const backBtn = container.querySelector('#back-btn');
        const cancelBtn = container.querySelector('#cancel-btn');

        backBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            router.navigate('/manage-users');
        });

        cancelBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
                router.navigate('/manage-users');
            }
        });

        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Form submission started');

            if (!canEdit) {
                alert('You do not have permission to update this user.');
                return;
            }

            const formData = new FormData(form);
            const employeeData = {};

            for (let [key, value] of formData.entries()) {
                if (key !== 'password' || (key === 'password' && value.trim() !== '')) {
                    if (value && value.trim() !== '') {
                        employeeData[key] = value.trim();
                    }
                }
            }

            if (!employeeData.password || employeeData.password.length === 0) {
                delete employeeData.password;
            }

            // Validation
            if (!employeeData.employee_code) {
                alert('Employee code is required');
                return;
            }
            if (!employeeData.first_name) {
                alert('First name is required');
                return;
            }
            if (!employeeData.last_name) {
                alert('Last name is required');
                return;
            }
            if (!employeeData.email) {
                alert('Email is required');
                return;
            }
            if (employeeData.password && employeeData.password.length < 6) {
                alert('New password must be at least 6 characters long');
                return;
            }
            if (!employeeData.hire_date) {
                alert('Hire date is required');
                return;
            }
            if (!employeeData.role_id) {
                alert('Role is required');
                return;
            }
            if (!employeeData.headquarters_id) {
                alert('Headquarters is required');
                return;
            }
            if (!employeeData.status_id) {
                alert('Status is required');
                return;
            }

            try {
                updateBtn.disabled = true;
                updateBtn.querySelector('.btn-text').classList.add('hidden');
                updateBtn.querySelector('.btn-loading').classList.remove('hidden');
                console.log('Sending update request:', employeeData);

                await apiRequest(`/employees/${employeeId}`, 'PUT', employeeData);

                alert('User updated successfully');
                router.navigate('/manage-users');
            } catch (error) {
                console.error('Error updating employee:', error);
                alert(`Error updating user: ${error.message}`);
            } finally {
                updateBtn.disabled = false;
                updateBtn.querySelector('.btn-text').classList.remove('hidden');
                updateBtn.querySelector('.btn-loading').classList.add('hidden');
            }
        });

        const passwordInput = container.querySelector('#password');
        if (passwordInput) {
            passwordInput.addEventListener('focus', () => {
                if (!passwordInput.dataset.hintShown) {
                    passwordInput.placeholder = 'Leave empty to keep current password';
                    passwordInput.dataset.hintShown = 'true';
                }
            });
        }

    } catch (error) {
        console.error('Error in showEditEmployeePage:', error);

        container.innerHTML = error.message.includes('404') || error.message.includes('not found') ? `
            <div class="bg-red-100 border border-red-400 text-red-700 p-6 rounded-lg mb-4">
                <h3 class="text-lg font-semibold">User Not Found</h3>
                <p>The user you are trying to edit does not exist or has been deleted.</p>
                <button class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" onclick="window.history.back()">Back</button>
            </div>
        ` : `
            <div class="bg-red-100 border border-red-400 text-red-700 p-6 rounded-lg mb-4">
                <h3 class="text-lg font-semibold">Error Loading User</h3>
                <p>${error.message || 'Unknown error'}</p>
                <p>Please verify that the server is working correctly.</p>
                <div class="flex gap-4 mt-4">
                    <button class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600" onclick="window.history.back()">Back</button>
                    <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" onclick="window.location.reload()">Try Again</button>
                </div>
            </div>
        `;
    }

    return container;
}