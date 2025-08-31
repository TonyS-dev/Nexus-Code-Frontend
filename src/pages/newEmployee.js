import { auth } from '../services/auth.service.js';
import { apiRequest } from '../services/api.service.js';
import { router } from '../router/router.js';
import { getUserAccessLevel } from '../utils/helpers.js';

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
  container.className = 'content-section';

  try {
    container.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading form data...</p>
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
      <div class="main-header">
        <h1>New Employee</h1>
        <button class="btn btn-secondary" onclick="history.back()">
          <i class="icon-arrow-left"></i> Back
        </button>
      </div>
      
      <div class="form-container">
        <form id="new-employee-form" class="employee-form">
          <div class="form-group">
            <label for="employee_code">Employee Code *</label>
            <input type="text" id="employee_code" name="employee_code" required class="form-input" placeholder="EMP-001">
          </div>
          
          <div class="form-group">
            <label for="first_name">First Name *</label>
            <input type="text" id="first_name" name="first_name" required class="form-input">
          </div>
          
          <div class="form-group">
            <label for="middle_name">Middle Name</label>
            <input type="text" id="middle_name" name="middle_name" class="form-input">
          </div>
          
          <div class="form-group">
            <label for="last_name">Last Name *</label>
            <input type="text" id="last_name" name="last_name" required class="form-input">
          </div>
          
          <div class="form-group">
            <label for="second_last_name">Second Last Name</label>
            <input type="text" id="second_last_name" name="second_last_name" class="form-input">
          </div>
          
          <div class="form-group">
            <label for="email">Email *</label>
            <input type="email" id="email" name="email" required class="form-input">
          </div>
          
          <div class="form-group">
            <label for="password">Password *</label>
            <input type="password" id="password" name="password" required class="form-input" minlength="6">
          </div>
          
          <div class="form-group">
            <label for="phone">Phone</label>
            <input type="tel" id="phone" name="phone" class="form-input">
          </div>
          
          <div class="form-group">
            <label for="birth_date">Birth Date</label>
            <input type="date" id="birth_date" name="birth_date" class="form-input">
          </div>
          
          <div class="form-group">
            <label for="hire_date">Hire Date *</label>
            <input type="date" id="hire_date" name="hire_date" required class="form-input" value="${new Date().toISOString().split('T')[0]}">
          </div>
          
          <div class="form-group">
            <label for="gender_id">Gender</label>
            <select id="gender_id" name="gender_id" class="form-select">
              <option value="">Select gender...</option>
              ${safeGenders.map(g => `<option value="${g.id}">${g.name}</option>`).join('')}
            </select>
          </div>
          
          <div class="form-group">
            <label for="identification_type_id">ID Type</label>
            <select id="identification_type_id" name="identification_type_id" class="form-select">
              <option value="">Select type...</option>
              ${safeIdentificationTypes.map(it => `<option value="${it.id}">${it.name}</option>`).join('')}
            </select>
          </div>
          
          <div class="form-group">
            <label for="identification_number">ID Number</label>
            <input type="text" id="identification_number" name="identification_number" class="form-input">
          </div>
          
          <div class="form-group">
            <label for="role_id">Role *</label>
            <select id="role_id" name="role_id" required class="form-select">
              <option value="">Select a role</option>
              ${safeRoles.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}
            </select>
          </div>
          
          <div class="form-group">
            <label for="headquarters_id">Headquarters *</label>
            <select id="headquarters_id" name="headquarters_id" required class="form-select">
              <option value="">Select headquarters...</option>
              ${safeHeadquarters.map(hq => `<option value="${hq.id}">${hq.name}</option>`).join('')}
            </select>
          </div>
          
          <div class="form-group">
            <label for="status_id">Status *</label>
            <select id="status_id" name="status_id" required class="form-select">
              <option value="">Select status...</option>
              ${safeEmployeeStatuses.map(es => `<option value="${es.id}">${es.name}</option>`).join('')}
            </select>
          </div>
          
          <div class="form-group">
            <label for="access_level_id">Access Level</label>
            <select id="access_level_id" name="access_level_id" class="form-select">
              <option value="">Select access level...</option>
              ${safeAccessLevels.map(al => `<option value="${al.id}">${al.name}</option>`).join('')}
            </select>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">
              <i class="icon-save"></i> Create Employee
            </button>
            <button type="button" class="btn btn-secondary" onclick="history.back()">
              Cancel
            </button>
          </div>
        </form>
      </div>
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
    const employeeData = Object.fromEntries(formData.entries());
    
    try {
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="icon-loading"></i> Creating...';
      
      await apiRequest('/employees', 'POST', employeeData);
      
      alert('Employee created successfully!');
      router.navigate('/manage-users');
      
    } catch (error) {
      alert(`Error creating employee: ${error.message}`);
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="icon-save"></i> Create Employee';
    }
  });

  return container;
}