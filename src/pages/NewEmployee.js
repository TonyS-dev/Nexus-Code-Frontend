import { auth } from '../services/auth.service.js';
import { apiRequest } from '../services/api.service.js';
import { router } from '../router/router.js';
import { getUserAccessLevel, cleanFormData } from '../utils/helpers.js';

export async function showNewEmployeePage() {
  try {
    const user = auth.isAuthenticated() ? await auth.getUser() : null;
    
    if (!user) { 
      router.navigate('/login'); 
      return document.createElement('div'); 
    }
    
    // Check access level for permissions - Admin access level can create employees
    const userAccessLevel = getUserAccessLevel(user);
    
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
    container.className = 'w-full h-full flex flex-col';    try {
        container.innerHTML = `
            <div class="p-6 text-text-secondary flex items-center justify-center">
                <div class="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                <span class="ml-3">Loading form data...</span>
            </div>
        `;

    // Fetch required data for the form
    const [roles, headquarters, genders, employeeStatuses, identificationTypes, accessLevels] = await Promise.all([
      apiRequest('/roles'),
      apiRequest('/headquarters'),
      apiRequest('/genders'),
      apiRequest('/employee-statuses'),
      apiRequest('/identification-types'),
      apiRequest('/access-levels')
    ]);

    // Ensure all arrays are safe
    const safeRoles = Array.isArray(roles) ? roles : [];
    const safeHeadquarters = Array.isArray(headquarters) ? headquarters : [];
    const safeGenders = Array.isArray(genders) ? genders : [];
    const safeEmployeeStatuses = Array.isArray(employeeStatuses) ? employeeStatuses : [];
    const safeIdentificationTypes = Array.isArray(identificationTypes) ? identificationTypes : [];
    const safeAccessLevels = Array.isArray(accessLevels) ? accessLevels : [];

    container.innerHTML = `
      <main class="flex-1 p-6 overflow-y-auto">
        <div class="bg-background-primary p-6 rounded-xl shadow-special border border-border-color">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-border-color">
            <h2 class="text-xl font-semibold text-text-primary">New Employee</h2>
            <button type="button" onclick="history.back()" class="bg-gray-200 text-text-secondary font-semibold py-2 px-5 rounded-lg hover:bg-gray-300 transition-colors mt-4 sm:mt-0">
              <i class="fa-solid fa-arrow-left mr-2"></i>Back
            </button>
          </div>
          
          <form id="new-employee-form" class="space-y-6">
            <div class="bg-background-secondary p-6 rounded-lg border border-border-color">
              <h3 class="text-lg font-semibold text-text-primary mb-4 border-b-2 border-primary pb-2">Personal Information</h3>
              <p class="text-sm text-text-secondary mb-4 italic">Fields marked with <span class="text-red-500 font-bold">*</span> are required</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="employee_code" class="block text-sm font-medium text-text-secondary mb-2">
                    Employee Code <span class="text-red-500">*</span>
                  </label>
                  <input type="text" id="employee_code" name="employee_code" required class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary" placeholder="EMP-001">
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-text-secondary mb-2">
                    Email <span class="text-red-500">*</span>
                  </label>
                  <input type="email" id="email" name="email" required class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary">
                </div>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label for="first_name" class="block text-sm font-medium text-text-secondary mb-2">
                    First Name <span class="text-red-500">*</span>
                  </label>
                  <input type="text" id="first_name" name="first_name" required class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary">
                </div>
                <div>
                  <label for="middle_name" class="block text-sm font-medium text-text-secondary mb-2">Middle Name</label>
                  <input type="text" id="middle_name" name="middle_name" class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary">
                </div>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label for="last_name" class="block text-sm font-medium text-text-secondary mb-2">
                    Last Name <span class="text-red-500">*</span>
                  </label>
                  <input type="text" id="last_name" name="last_name" required class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary">
                </div>
                <div>
                  <label for="second_last_name" class="block text-sm font-medium text-text-secondary mb-2">Second Last Name</label>
                  <input type="text" id="second_last_name" name="second_last_name" class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary">
                </div>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label for="password" class="block text-sm font-medium text-text-secondary mb-2">
                    Password <span class="text-red-500">*</span>
                  </label>
                  <input type="password" id="password" name="password" required class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary" minlength="6">
                  <p class="text-xs text-text-muted mt-1">Minimum 6 characters required</p>
                </div>
                <div>
                  <label for="phone" class="block text-sm font-medium text-text-secondary mb-2">
                    Phone <span class="text-red-500">*</span>
                  </label>
                  <input type="tel" id="phone" name="phone" required class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary" placeholder="+57 300 123 4567">
                </div>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label for="birth_date" class="block text-sm font-medium text-text-secondary mb-2">
                    Birth Date <span class="text-red-500">*</span>
                  </label>
                  <input type="date" id="birth_date" name="birth_date" required class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary">
                </div>
                <div>
                  <label for="gender_id" class="block text-sm font-medium text-text-secondary mb-2">
                    Gender <span class="text-red-500">*</span>
                  </label>
                  <select id="gender_id" name="gender_id" required class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary">
                    <option value="">Select gender...</option>
                    ${safeGenders.map(g => `<option value="${g.id}">${g.name}</option>`).join('')}
                  </select>
                </div>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label for="identification_type_id" class="block text-sm font-medium text-text-secondary mb-2">
                    ID Type <span class="text-red-500">*</span>
                  </label>
                  <select id="identification_type_id" name="identification_type_id" required class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary">
                    <option value="">Select type...</option>
                    ${safeIdentificationTypes.map(it => `<option value="${it.id}">${it.name}</option>`).join('')}
                  </select>
                </div>
                <div>
                  <label for="identification_number" class="block text-sm font-medium text-text-secondary mb-2">
                    ID Number <span class="text-red-500">*</span>
                  </label>
                  <input type="text" id="identification_number" name="identification_number" required class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary" placeholder="12345678">
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
                  <input type="date" id="hire_date" name="hire_date" required class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div>
                  <label for="role_id" class="block text-sm font-medium text-text-secondary mb-2">
                    Role <span class="text-red-500">*</span>
                  </label>
                  <select id="role_id" name="role_id" required class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary">
                    <option value="">Select a role</option>
                    ${safeRoles.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}
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
                    ${safeHeadquarters.map(hq => `<option value="${hq.id}">${hq.name}</option>`).join('')}
                  </select>
                </div>
                <div>
                  <label for="status_id" class="block text-sm font-medium text-text-secondary mb-2">
                    Status <span class="text-red-500">*</span>
                  </label>
                  <select id="status_id" name="status_id" required class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary">
                    <option value="">Select status...</option>
                    ${safeEmployeeStatuses.map(es => `<option value="${es.id}">${es.name}</option>`).join('')}
                  </select>
                </div>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label for="access_level_id" class="block text-sm font-medium text-text-secondary mb-2">
                    Access Level <span class="text-red-500">*</span>
                  </label>
                  <select id="access_level_id" name="access_level_id" required class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary">
                    <option value="">Select access level...</option>
                    ${safeAccessLevels.map(al => `<option value="${al.id}">${al.name}</option>`).join('')}
                  </select>
                </div>
                <div>
                  <label for="manager_id" class="block text-sm font-medium text-text-secondary mb-2">Manager (optional)</label>
                  <select id="manager_id" name="manager_id" class="w-full px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary">
                    <option value="">No manager assigned...</option>
                    <!-- Manager options would be loaded here if available -->
                  </select>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end gap-4 pt-6">
              <button type="button" onclick="history.back()" class="bg-gray-200 text-text-secondary font-semibold py-2 px-5 rounded-lg hover:bg-gray-300 transition-colors">
                Cancel
              </button>
              <button type="submit" class="bg-primary text-white font-semibold py-2 px-5 rounded-lg hover:bg-primary-hover transition-colors">
                <i class="fa-solid fa-user-plus mr-2"></i>Create Employee
              </button>
            </div>
          </form>
        </div>
      </main>
    `;

  } catch (error) {
    container.innerHTML = `
      <div class="alert error">
        <h3>Loading Error</h3>
        <p>${error.message}</p>
        <button class="btn" onclick="window.location.reload()">Retry</button>
      </div>
    `;
  }

  // Form submission handler
  const form = container.querySelector('#new-employee-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    
    // Define required fields based on our database constraints
    const requiredFields = [
      'employee_code', 'first_name', 'last_name', 'email', 'password', 'phone', 
      'birth_date', 'identification_type_id', 'identification_number', 
      'gender_id', 'access_level_id', 'hire_date', 'role_id', 
      'headquarters_id', 'status_id'
    ];
    
    // Clean form data using helper function
    const employeeData = cleanFormData(formData, requiredFields);
    
    // Enhanced validation with better error messages
    const validationErrors = [];
    
    if (!employeeData.employee_code) validationErrors.push('Employee Code');
    if (!employeeData.first_name) validationErrors.push('First Name');
    if (!employeeData.last_name) validationErrors.push('Last Name');
    if (!employeeData.email) validationErrors.push('Email');
    if (!employeeData.password) validationErrors.push('Password');
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

    // Password length validation
    if (employeeData.password.length < 6) {
      alert('Password must be at least 6 characters long');
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
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Creating...';
      
      console.log('Sending employee data:', employeeData);
      await apiRequest('/employees', 'POST', employeeData);
      
      alert('Employee created successfully!');
      router.navigate('/manage-users');
      
    } catch (error) {
      console.error('Error creating employee:', error);
      alert(`Error creating employee: ${error.message}`);
    } finally {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-user-plus mr-2"></i>Create Employee';
      }
    }
  });

  return container;
}