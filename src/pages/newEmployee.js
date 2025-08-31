import { auth } from '../services/auth.service.js';
import { apiRequest } from '../services/api.service.js';
import { router } from '../router/router.js';

function getEmployeeRole(emp) {
  if (!emp) return 'No role';
  
  // Try to get role from different possible structures
  let role = '';
  
  if (typeof emp.roles === 'string') {
    try {
      const rolesArray = JSON.parse(emp.roles);
      if (Array.isArray(rolesArray) && rolesArray.length > 0) {
        role = rolesArray[0].name || rolesArray[0] || '';
      }
    } catch (e) {
      console.warn('Error parsing roles JSON:', e);
    }
  }
  
  if (!role && Array.isArray(emp.roles) && emp.roles.length > 0) {
    role = emp.roles[0].name || emp.roles[0] || '';
  }
  
  if (!role) {
    role = emp.role || emp.role_name || emp.roleName || '';
  }
  
  return role || 'No role';
}

export async function showNewEmployeePage() {
  try {
    const user = auth.isAuthenticated() ? await auth.getUser() : null;
    if (!user) { 
      router.navigate('/login'); 
      return document.createElement('div'); 
    }
    
    // Check if user has permission to create new employees
    const userRole = getEmployeeRole(user);
    console.log('Current user role:', userRole);
    
    const allowedRoles = ['Admin', 'HR Talent Leader', 'Manager', 'CEO', 'admin', 'hr talent leader', 'manager', 'ceo'];
    
    if (!allowedRoles.some(role => role.toLowerCase() === userRole.toLowerCase())) { 
      console.log('Access denied for role:', userRole);
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
          <label for="first_name">First Name *</label>
          <input type="text" id="first_name" name="first_name" required class="form-input">
        </div>
        
        <div class="form-group">
          <label for="last_name">Last Name *</label>
          <input type="text" id="last_name" name="last_name" required class="form-input">
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
          <label for="role">Role *</label>
          <select id="role" name="role" required class="form-select">
            <option value="">Select a role</option>
            <option value="Employee">Employee</option>
            <option value="Developer">Developer</option>
            <option value="Manager">Manager</option>
            <option value="HR Talent Leader">HR Talent Leader</option>
            <option value="Learning Leader">Learning Leader</option>
            <option value="Admin">Admin</option>
            <option value="CEO">CEO</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="department">Department</label>
          <input type="text" id="department" name="department" class="form-input" placeholder="e.g., Engineering, HR, Sales">
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