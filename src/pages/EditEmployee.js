import { auth } from '../services/auth.service.js';
import { apiRequest } from '../services/api.service.js';
import { router } from '../router/router.js';
import { getUserAccessLevel, formatDateForInput, cleanFormData } from '../utils/helpers.js'

export async function showEditEmployeePage(params = {}) {
    const employeeId = params?.id;

    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col';

    if (!employeeId) {
        console.warn('No employee ID found');
        container.innerHTML = `
            <div class="bg-red-100 border border-red-400 text-red-700 p-6 rounded-lg mb-4">
                <h3 class="text-lg font-semibold">Error</h3>
                <p>No valid employee ID provided.</p>
                <button class="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700" onclick="window.history.back()">Back</button>
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
            <div class="p-6 text-text-secondary flex items-center justify-center">
                <div class="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                <span class="ml-3">Loading user information...</span>
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
            <main class="flex-1 p-6 overflow-y-auto">
                <div class="bg-background-primary p-6 rounded-xl shadow-special border border-border-color">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-border-color">
                        <h2 class="text-xl font-semibold text-text-primary">Edit User: ${
                            employee.first_name || ''
                        } ${employee.last_name || ''}</h2>
                        <button class="bg-gray-200 text-text-secondary font-semibold py-2 px-5 rounded-lg hover:bg-gray-300 transition-colors mt-4 sm:mt-0 flex items-center gap-2" id="back-btn">
                            <i class="fa-solid fa-arrow-left mr-2"></i>Back
                        </button>
                    </div>

                    <form id="edit-employee-form" class="space-y-6">
                        <div class="bg-background-secondary p-6 rounded-lg border border-border-color">
                            <h3 class="text-lg font-semibold text-text-primary mb-4 border-b-2 border-primary pb-2">Personal Information</h3>
                            <p class="text-sm text-text-secondary mb-4 italic">Fields marked with <span class="text-red-500 font-bold">*</span> are required</p>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label for="employee_code" class="block text-sm font-medium text-text-secondary mb-2">
                                        Employee Code <span class="text-red-500">*</span>
                                    </label>
                                    <input type="text" id="employee_code" name="employee_code" required class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary" 
                                           placeholder="EMP001" maxlength="20" value="${
                                               employee.employee_code || ''
                                           }">
                                </div>
                                <div>
                                    <label for="email" class="block text-sm font-medium text-text-secondary mb-2">
                                        Email <span class="text-red-500">*</span>
                                    </label>
                                    <input type="email" id="email" name="email" required class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary" 
                                           placeholder="user@nexus.com" maxlength="60" value="${
                                               employee.email || ''
                                           }">
                                </div>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label for="first_name" class="block text-sm font-medium text-text-secondary mb-2">
                                        First Name <span class="text-red-500">*</span>
                                    </label>
                                    <input type="text" id="first_name" name="first_name" required class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary" 
                                           maxlength="40" value="${
                                               employee.first_name || ''
                                           }">
                                </div>
                                <div>
                                    <label for="middle_name" class="block text-sm font-medium text-text-secondary mb-2">Middle Name</label>
                                    <input type="text" id="middle_name" name="middle_name" class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary" 
                                           maxlength="40" value="${
                                               employee.middle_name || ''
                                           }">
                                </div>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label for="last_name" class="block text-sm font-medium text-text-secondary mb-2">
                                        Last Name <span class="text-red-500">*</span>
                                    </label>
                                    <input type="text" id="last_name" name="last_name" required class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary" 
                                           maxlength="40" value="${
                                               employee.last_name || ''
                                           }">
                                </div>
                                <div>
                                    <label for="second_last_name" class="block text-sm font-medium text-text-secondary mb-2">Second Last Name</label>
                                    <input type="text" id="second_last_name" name="second_last_name" class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary" 
                                           maxlength="40" value="${
                                               employee.second_last_name || ''
                                           }">
                                </div>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label for="phone" class="block text-sm font-medium text-text-secondary mb-2">
                                        Phone <span class="text-red-500">*</span>
                                    </label>
                                    <input type="tel" id="phone" name="phone" required class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary" 
                                           placeholder="+57 300 123 4567" maxlength="20" value="${
                                               employee.phone || ''
                                           }">
                                </div>
                                <div>
                                    <label for="birth_date" class="block text-sm font-medium text-text-secondary mb-2">
                                        Birth Date <span class="text-red-500">*</span>
                                    </label>
                                    <input type="date" id="birth_date" name="birth_date" required class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary" 
                                           value="${formattedBirthDate}">
                                </div>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label for="gender_id" class="block text-sm font-medium text-text-secondary mb-2">
                                        Gender <span class="text-red-500">*</span>
                                    </label>
                                    <select id="gender_id" name="gender_id" required class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary">
                                        <option value="">Select gender...</option>
                                        ${safeGenders
                                            .map(
                                                (g) =>
                                                    `<option value="${g.id}" ${
                                                        g.name ===
                                                        (employee.gender || '')
                                                            ? 'selected'
                                                            : ''
                                                    }>${g.name || ''}</option>`
                                            )
                                            .join('')}
                                    </select>
                                </div>
                                <div>
                                    <label for="identification_type_id" class="block text-sm font-medium text-text-secondary mb-2">
                                        ID Type <span class="text-red-500">*</span>
                                    </label>
                                    <select id="identification_type_id" name="identification_type_id" required class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary">
                                        <option value="">Select type...</option>
                                        ${safeIdentificationTypes
                                            .map(
                                                (it) =>
                                                    `<option value="${it.id}" ${
                                                        it.name ===
                                                        (employee.identification_type ||
                                                            '')
                                                            ? 'selected'
                                                            : ''
                                                    }>${it.name || ''}</option>`
                                            )
                                            .join('')}
                                    </select>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label for="identification_number" class="block text-sm font-medium text-text-secondary mb-2">
                                        ID Number <span class="text-red-500">*</span>
                                    </label>
                                    <input type="text" id="identification_number" name="identification_number" required class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary" 
                                           placeholder="12345678" maxlength="50" value="${
                                               employee.identification_number ||
                                               ''
                                           }">
                                </div>
                                <div>
                                    <label for="password" class="block text-sm font-medium text-text-secondary mb-2">New Password (optional)</label>
                                    <input type="password" id="password" name="password" class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary" 
                                           placeholder="Leave blank to keep current password" minlength="6">
                                    <p class="text-xs text-text-muted mt-1">Minimum 6 characters. Leave empty to keep current password.</p>
                                </div>
                            </div>
                        </div>

                        <div class="bg-background-secondary p-6 rounded-lg border border-border-color">
                            <h3 class="text-lg font-semibold text-text-primary mb-4 border-b-2 border-primary pb-2">Job Information</h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label for="hire_date" class="block text-sm font-medium text-text-secondary mb-2">
                                        Hire Date <span class="text-red-500">*</span>
                                    </label>
                                    <input type="date" id="hire_date" name="hire_date" required class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary" 
                                           value="${formattedHireDate}">
                                </div>
                                <div>
                                    <label for="role_id" class="block text-sm font-medium text-text-secondary mb-2">
                                        Role <span class="text-red-500">*</span>
                                    </label>
                                    <select id="role_id" name="role_id" required class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary">
                                        <option value="">Select role...</option>
                                        ${safeRoles
                                            .map(
                                                (r) =>
                                                    `<option value="${r.id}" ${
                                                        r.id === currentRoleId
                                                            ? 'selected'
                                                            : ''
                                                    }>${r.name || ''}</option>`
                                            )
                                            .join('')}
                                    </select>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label for="headquarters_id" class="block text-sm font-medium text-text-secondary mb-2">
                                        Headquarters <span class="text-red-500">*</span>
                                    </label>
                                    <select id="headquarters_id" name="headquarters_id" required class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary">
                                        <option value="">Select headquarters...</option>
                                        ${safeHeadquarters
                                            .map(
                                                (hq) =>
                                                    `<option value="${hq.id}" ${
                                                        hq.name ===
                                                        (employee.headquarters_name ||
                                                            '')
                                                            ? 'selected'
                                                            : ''
                                                    }>${hq.name || ''}</option>`
                                            )
                                            .join('')}
                                    </select>
                                </div>
                                <div>
                                    <label for="manager_id" class="block text-sm font-medium text-text-secondary mb-2">Manager (optional)</label>
                                    <select id="manager_id" name="manager_id" class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary">
                                        <option value="">No manager assigned...</option>
                                        ${safeManagers
                                            .map(
                                                (m) =>
                                                    `<option value="${m.id}" ${
                                                        m.id ===
                                                        (employee.manager_id ||
                                                            '')
                                                            ? 'selected'
                                                            : ''
                                                    }>${m.first_name || ''} ${
                                                        m.last_name || ''
                                                    }</option>`
                                            )
                                            .join('')}
                                    </select>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label for="status_id" class="block text-sm font-medium text-text-secondary mb-2">
                                        Status <span class="text-red-500">*</span>
                                    </label>
                                    <select id="status_id" name="status_id" required class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary">
                                        <option value="">Select status...</option>
                                        ${safeEmployeeStatuses
                                            .map(
                                                (es) =>
                                                    `<option value="${es.id}" ${
                                                        es.name ===
                                                        (employee.employee_status ||
                                                            '')
                                                            ? 'selected'
                                                            : ''
                                                    }>${es.name || ''}</option>`
                                            )
                                            .join('')}
                                    </select>
                                </div>
                                <div>
                                    <label for="access_level_id" class="block text-sm font-medium text-text-secondary mb-2">
                                        Access Level <span class="text-red-500">*</span>
                                    </label>
                                    <select id="access_level_id" name="access_level_id" required class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary">
                                        <option value="">Select level...</option>
                                        ${safeAccessLevels
                                            .map(
                                                (al) =>
                                                    `<option value="${al.id}" ${
                                                        al.name ===
                                                        (employee.access_level ||
                                                            '')
                                                            ? 'selected'
                                                            : ''
                                                    }>${al.name || ''}</option>`
                                            )
                                            .join('')}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="bg-background-secondary/50 p-6 rounded-lg border border-border-color">
                            <h3 class="text-lg font-semibold text-text-primary mb-4 border-b-2 border-primary pb-2">System Information</h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-text-secondary mb-2">Creation Date:</label>
                                    <span class="block text-sm text-text-muted">${
                                        employee.created_at
                                            ? new Date(
                                                  employee.created_at
                                              ).toLocaleDateString('es-ES')
                                            : 'Not available'
                                    }</span>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-text-secondary mb-2">Last Update:</label>
                                    <span class="block text-sm text-text-muted">${
                                        employee.updated_at
                                            ? new Date(
                                                  employee.updated_at
                                              ).toLocaleDateString('es-ES')
                                            : 'Never'
                                    }</span>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-text-secondary mb-2">Current Manager:</label>
                                    <span class="block text-sm text-text-muted">${
                                        (employee.manager_first_name || '') &&
                                        (employee.manager_last_name || '')
                                            ? `${employee.manager_first_name} ${employee.manager_last_name}`
                                            : 'No manager'
                                    }</span>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-text-secondary mb-2">Current Status:</label>
                                    <span class="inline-block px-2 py-1 text-xs font-medium text-white rounded-full ${
                                        employee.employee_status === 'Active'
                                            ? 'bg-green-500'
                                            : employee.employee_status === 'Suspended'
                                            ? 'bg-yellow-500'
                                            : employee.employee_status === 'Inactive'
                                            ? 'bg-red-500'
                                            : 'bg-gray-500'
                                    }">${employee.employee_status || 'No status'}</span>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-end gap-4 pt-6">
                            <button type="button" class="bg-gray-200 text-text-secondary font-semibold py-2 px-5 rounded-lg hover:bg-gray-300 transition-colors" id="cancel-btn">Cancel</button>
                            ${
                                canEdit
                                    ? `
                                <button type="submit" class="bg-primary text-white font-semibold py-2 px-5 rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2" id="update-btn">
                                    <span class="btn-text">Update User</span>
                                    <span class="btn-loading hidden">Updating...</span>
                                </button>
                            `
                                    : ''
                            }
                        </div>
                    </form>
                </div>
            </main>
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
            
            // Define required fields based on our database constraints
            const requiredFields = [
                'employee_code', 'first_name', 'last_name', 'email', 'phone', 
                'birth_date', 'identification_type_id', 'identification_number', 
                'gender_id', 'access_level_id', 'hire_date', 'role_id', 
                'headquarters_id', 'status_id'
            ];
            
            // Clean form data using helper function
            const employeeData = cleanFormData(formData, requiredFields);

            // Handle password separately (only include if provided)
            const password = formData.get('password')?.trim();
            if (password && password.length > 0) {
                if (password.length < 6) {
                    alert('New password must be at least 6 characters long');
                    return;
                }
                employeeData.password = password;
            }

            // Enhanced validation with better error messages
            const validationErrors = [];
            
            if (!employeeData.employee_code) validationErrors.push('Employee Code');
            if (!employeeData.first_name) validationErrors.push('First Name');
            if (!employeeData.last_name) validationErrors.push('Last Name');
            if (!employeeData.email) validationErrors.push('Email');
            if (!employeeData.phone) validationErrors.push('Phone');
            if (!employeeData.birth_date) validationErrors.push('Birth Date');
            if (!employeeData.identification_type_id) validationErrors.push('ID Type');
            if (!employeeData.identification_number) validationErrors.push('ID Number');
            if (!employeeData.gender_id) validationErrors.push('Gender');
            if (!employeeData.access_level_id) validationErrors.push('Access Level');
            if (!employeeData.hire_date) validationErrors.push('Hire Date');
            if (!employeeData.role_id) validationErrors.push('Role');
            if (!employeeData.headquarters_id) validationErrors.push('Headquarters');
            if (!employeeData.status_id) validationErrors.push('Status');

            if (validationErrors.length > 0) {
                alert(`The following required fields are missing:\n\n• ${validationErrors.join('\n• ')}\n\nPlease fill in all required fields marked with (*)`);
                return;
            }

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(employeeData.email)) {
                alert('Please enter a valid email address');
                return;
            }

            // Phone format validation
            const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,20}$/;
            if (!phoneRegex.test(employeeData.phone)) {
                alert('Please enter a valid phone number');
                return;
            }

            // Date format validation
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(employeeData.hire_date)) {
                alert('Hire date must be in YYYY-MM-DD format');
                return;
            }
            if (!dateRegex.test(employeeData.birth_date)) {
                alert('Birth date must be in YYYY-MM-DD format');
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
                <button class="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700" onclick="window.history.back()">Back</button>
            </div>
        ` : `
            <div class="bg-red-100 border border-red-400 text-red-700 p-6 rounded-lg mb-4">
                <h3 class="text-lg font-semibold">Error Loading User</h3>
                <p>${error.message || 'Unknown error'}</p>
                <p>Please verify that the server is working correctly.</p>
                <div class="flex gap-4 mt-4">
                    <button class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600" onclick="window.history.back()">Back</button>
                    <button class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700" onclick="window.location.reload()">Try Again</button>
                </div>
            </div>
        `;
    }

    return container;
}