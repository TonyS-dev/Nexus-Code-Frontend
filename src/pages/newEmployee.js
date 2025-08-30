import { auth } from '../services/auth.service.js';
import { apiRequest } from '../services/api.service.js';
import { router } from '../router/router.js';

export async function showNewEmployeePage() {
  // Authorization check
  try {
    const user = auth.isAuthenticated() ? await auth.getUser() : null;
    
    if (!user) {
      router.navigate('/login');
      return document.createElement('div');
    }
    
    const superiorRoles = ['Admin', 'HR Talent Leader', 'Manager', 'CEO'];
    const userRole = user?.role || user?.roles?.[0]?.name || 'Employee';
    
    if (!superiorRoles.includes(userRole)) {
      router.navigate('/forbidden');
      return document.createElement('div');
    }
  } catch (error) {
    console.error('Error during authorization:', error);
    router.navigate('/login');
    return document.createElement('div');
  }

  const container = document.createElement('div');
  container.className = 'max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md';

  try {
    // Show loading while fetching catalog data
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center p-12 text-center">
        <div class="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p class="text-gray-600">Loading form...</p>
      </div>
    `;

    // Fetch catalog data
    const [roles, headquarters, genders, employeeStatuses, identificationTypes, accessLevels, managers] = await Promise.all([
      apiRequest('/roles'),
      apiRequest('/headquarters'),
      apiRequest('/genders'),
      apiRequest('/employee-statuses'),
      apiRequest('/identification-types'),
      apiRequest('/access-levels'),
      apiRequest('/employees?role=Manager')
    ]);

    container.innerHTML = `
      <div class="flex justify-between items-center mb-8 pb-4 border-b-2 border-gray-200">
        <h1 class="text-2xl font-semibold text-gray-800">New User</h1>
        <button class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors flex items-center gap-2" id="back-btn">
          <span class="text-lg">←</span> Back
        </button>
      </div>

      <form id="new-employee-form" class="space-y-6">
        <div class="space-y-6">
          <!-- Personal Information Section -->
          <div class="bg-gray-50 p-6 rounded-md border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-700 border-b-2 border-blue-500 pb-2 mb-6">Personal Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div class="flex flex-col">
                <label for="employee_code" class="text-sm font-medium text-gray-600 after:content-['_*'] after:text-red-500">Employee Code</label>
                <input type="text" id="employee_code" name="employee_code" required class="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                       placeholder="EMP001" maxlength="20">
              </div>
              <div class="flex flex-col">
                <label for="email" class="text-sm font-medium text-gray-600 after:content-['_*'] after:text-red-500">Email</label>
                <input type="email" id="email" name="email" required class="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                       placeholder="usuario@nexus.com" maxlength="60">
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div class="flex flex-col">
                <label for="first_name" class="text-sm font-medium text-gray-600 after:content-['_*'] after:text-red-500">First Name</label>
                <input type="text" id="first_name" name="first_name" required class="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                       placeholder="Juan" maxlength="40">
              </div>
              <div class="flex flex-col">
                <label for="middle_name" class="text-sm font-medium text-gray-600">Middle Name</label>
                <input type="text" id="middle_name" name="middle_name" class="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                       placeholder="Carlos" maxlength="40">
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div class="flex flex-col">
                <label for="last_name" class="text-sm font-medium text-gray-600 after:content-['_*'] after:text-red-500">Last Name</label>
                <input type="text" id="last_name" name="last_name" required class="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                       placeholder="Pérez" maxlength="40">
              </div>
              <div class="flex flex-col">
                <label for="second_last_name" class="text-sm font-medium text-gray-600">Second Last Name</label>
                <input type="text" id="second_last_name" name="second_last_name" class="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                       placeholder="García" maxlength="40">
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div class="flex flex-col">
                <label for="phone" class="text-sm font-medium text-gray-600">Phone</label>
                <input type="tel" id="phone" name="phone" class="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                       placeholder="+57 300 123 4567" maxlength="20">
              </div>
              <div class="flex flex-col">
                <label for="birth_date" class="text-sm font-medium text-gray-600">Birth Date</label>
                <input type="date" id="birth_date" name="birth_date" class="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div class="flex flex-col">
                <label for="gender_id" class="text-sm font-medium text-gray-600">Gender</label>
                <select id="gender_id" name="gender_id" class="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select gender...</option>
                  ${genders.map(g => `<option value="${g.id}">${g.name}</option>`).join('')}
                </select>
              </div>
              <div class="flex flex-col">
                <label for="identification_type_id" class="text-sm font-medium text-gray-600">Identification Type</label>
                <select id="identification_type_id" name="identification_type_id" class="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select type...</option>
                  ${identificationTypes.map(it => `<option value="${it.id}">${it.name}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex flex-col">
                <label for="identification_number" class="text-sm font-medium text-gray-600">Identification Number</label>
                <input type="text" id="identification_number" name="identification_number" class="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                       placeholder="12345678" maxlength="50">
              </div>
              <div class="flex flex-col">
                <label for="password" class="text-sm font-medium text-gray-600 after:content-['_*'] after:text-red-500">Password</label>
                <input type="password" id="password" name="password" required class="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                       placeholder="Secure password" minlength="6">
              </div>
            </div>
          </div>

          <!-- Employment Information Section -->
          <div class="bg-gray-50 p-6 rounded-md border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-700 border-b-2 border-blue-500 pb-2 mb-6">Employment Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div class="flex flex-col">
                <label for="hire_date" class="text-sm font-medium text-gray-600 after:content-['_*'] after:text-red-500">Hire Date</label>
                <input type="date" id="hire_date" name="hire_date" required class="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                       value="${new Date().toISOString().split('T')[0]}">
              </div>
              <div class="flex flex-col">
                <label for="role_id" class="text-sm font-medium text-gray-600 after:content-['_*'] after:text-red-500">Role</label>
                <select id="role_id" name="role_id" required class="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select role...</option>
                  ${roles.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div class="flex flex-col">
                <label for="headquarters_id" class="text-sm font-medium text-gray-600 after:content-['_*'] after:text-red-500">Headquarters</label>
                <select id="headquarters_id" name="headquarters_id" required class="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select headquarters...</option>
                  ${headquarters.map(hq => `<option value="${hq.id}">${hq.name}</option>`).join('')}
                </select>
              </div>
              <div class="flex flex-col">
                <label for="manager_id" class="text-sm font-medium text-gray-600">Manager</label>
                <select id="manager_id" name="manager_id" class="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">No manager assigned...</option>
                  ${managers.map(m => `<option value="${m.id}">${m.first_name} ${m.last_name}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div class="flex flex-col">
                <label for="status_id" class="text-sm font-medium text-gray-600 after:content-['_*'] after:text-red-500">Status</label>
                <select id="status_id" name="status_id" required class="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select status...</option>
                  ${employeeStatuses.map(es => `<option value="${es.id}">${es.name}</option>`).join('')}
                </select>
              </div>
              <div class="flex flex-col">
                <label for="access_level_id" class="text-sm font-medium text-gray-600">Access Level</label>
                <select id="access_level_id" name="access_level_id" class="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select level...</option>
                  ${accessLevels.map(al => `<option value="${al.id}">${al.name}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex flex-col">
                <label for="salary_amount" class="text-sm font-medium text-gray-600">Salary</label>
                <input type="number" id="salary_amount" name="salary_amount" class="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                       placeholder="5000000" min="0" step="1000">
              </div>
              <div class="flex flex-col">
                <label for="effective_date" class="text-sm font-medium text-gray-600">Effective Date of Salary</label>
                <input type="date" id="effective_date" name="effective_date" class="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                       value="${new Date().toISOString().split('T')[0]}">
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-4 pt-6 border-t border-gray-200 mt-6">
          <button type="button" class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors w-full md:w-auto" id="cancel-btn">Cancel</button>
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-full md:w-auto flex items-center justify-center" id="save-btn">
            <span class="btn-text">Create User</span>
            <span class="btn-loading hidden">Creating...</span>
          </button>
        </div>
      </form>
    `;

    // Event Listeners
    const form = container.querySelector('#new-employee-form');
    const saveBtn = container.querySelector('#save-btn');
    const backBtn = container.querySelector('#back-btn');
    const cancelBtn = container.querySelector('#cancel-btn');

    // Back button
    backBtn?.addEventListener('click', () => {
      router.navigate('/manage-users');
    });

    // Cancel button
    cancelBtn?.addEventListener('click', () => {
      if (confirm('Are you sure you want to cancel? Unsaved data will be lost.')) {
        router.navigate('/manage-users');
      }
    });

    // Form submission
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const employeeData = {};
      
      // Convert FormData to object
      for (let [key, value] of formData.entries()) {
        if (value && value.trim() !== '') {
          employeeData[key] = value.trim();
        }
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
      if (!employeeData.password || employeeData.password.length < 6) {
        alert('Password must be at least 6 characters');
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
        // Disable button and show loading
        saveBtn.disabled = true;
        saveBtn.querySelector('.btn-text').classList.add('hidden');
        saveBtn.querySelector('.btn-loading').classList.remove('hidden');

        // Create employee
        await apiRequest('/employees', 'POST', employeeData);

        // Success message
        alert('User created successfully');
        router.navigate('/manage-users');
        
      } catch (error) {
        console.error('Error creating employee:', error);
        alert(`Error creating user: ${error.message}`);
      } finally {
        // Re-enable button
        saveBtn.disabled = false;
        saveBtn.querySelector('.btn-text').classList.remove('hidden');
        saveBtn.querySelector('.btn-loading').classList.add('hidden');
      }
    });

    // Auto-fill effective_date when salary_amount is entered
    const salaryInput = container.querySelector('#salary_amount');
    const effectiveDateInput = container.querySelector('#effective_date');
    
    salaryInput?.addEventListener('input', () => {
      if (salaryInput.value && !effectiveDateInput.value) {
        effectiveDateInput.value = new Date().toISOString().split('T')[0];
      }
    });

  } catch (error) {
    console.error('Error in showNewEmployeePage:', error);
    container.innerHTML = `
      <div class="bg-red-100 border border-red-400 text-red-700 p-4 rounded-md mb-4">
        <h3 class="text-lg font-semibold">Error Loading Form</h3>
        <p>${error.message}</p>
        <p>Please verify that the server is working correctly.</p>
        <button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors mt-4" onclick="window.location.reload()">Try Again</button>
      </div>
    `;
  }

  return container;
}