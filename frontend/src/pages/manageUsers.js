import { auth } from '../services/auth.service.js';
import { apiRequest } from '../services/api.service.js';
import { router } from '../router/router.js';

function getEmployeeRole(emp) {
  if (typeof emp.roles === 'string') {
    try {
      const rolesArray = JSON.parse(emp.roles);
      if (Array.isArray(rolesArray) && rolesArray.length > 0) return rolesArray[0].name || rolesArray[0] || 'No role';
    } catch (e) { /* Silently fail */ }
  }
  if (Array.isArray(emp.roles) && emp.roles.length > 0) return emp.roles[0].name || emp.roles[0] || 'No role';
  return emp.role || emp.role_name || emp.roleName || 'No role';
}

function getDepartmentName(emp) {
  return emp.department || emp.area || emp.department_name || emp.headquarters_name || '–';
}

export async function showManageUsersPage() {
  try {
    const user = auth.isAuthenticated() ? await auth.getUser() : null;
    if (!user) { router.navigate('/login'); return document.createElement('div'); }
    const superiorRoles = ['Admin', 'HR Talent Leader', 'Manager', 'CEO'];
    if (!superiorRoles.includes(getEmployeeRole(user))) { router.navigate('/forbidden'); return document.createElement('div'); }
  } catch (error) { router.navigate('/login'); return document.createElement('div'); }

  const container = document.createElement('div');
  container.className = 'content-section';

  try {
    container.innerHTML = `<div class="loading-container"><div class="loading-spinner"></div><p>Loading users...</p></div>`;
    const employees = await apiRequest('/employees');
    if (!Array.isArray(employees)) throw new Error('Invalid server response.');

    const rows = employees.map(emp => {
      const fullName = `${emp.first_name || ''} ${emp.last_name || ''}`.trim();
      const userRole = getEmployeeRole(emp);
      return `
        <tr>
          <td>${fullName}</td><td>${emp.email || ''}</td>
          <td><span class="role-badge role-${userRole.toLowerCase().replace(/\s+/g, '-')}">${userRole}</span></td>
          <td>${getDepartmentName(emp)}</td>
          <td>
            <button class="btn-sm btn-edit" data-id="${emp.id}" title="Edit user"><i class="icon-edit"></i> Edit</button>
            <button class="btn-sm btn-delete" data-id="${emp.id}" data-name="${fullName}" title="Delete user"><i class="icon-delete"></i> Delete</button>
          </td>
        </tr>`;
    }).join('');

    container.innerHTML = `
      <div class="main-header"><h1>Manage Users</h1><button class="btn btn-primary" id="new-employee-btn"><i class="icon-plus"></i> New Employee</button></div>
      <div class="filters-section">
        <div class="filter-group"><label for="roles-filter">Filter by role:</label><select id="roles-filter" class="form-select"><option value="">All</option><option>CEO</option><option>Admin</option><option>HR Talent Leader</option><option>Manager</option><option>Employee</option></select></div>
        <div class="filter-group"><label for="search-input">Search:</label><input type="text" id="search-input" class="form-input" placeholder="Search by name or email..."></div>
      </div>
      <div class="table-container"><table class="data-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Area</th><th>Actions</th></tr></thead><tbody id="users-tbody">${rows}</tbody></table></div>
      <div class="table-footer"><span id="total-count">Total: ${employees.length} users</span></div>`;

    function attachEventListeners() {
      container.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', e => router.navigate(`/manage-users/edit/${e.currentTarget.dataset.id}`));
      });
      //container.querySelectorAll('.btn-delete').forEach(btn => {
      //  btn.addEventListener('click', async e => {
      //    const button = e.currentTarget;
      //    if (confirm(`Are you sure you want to delete ${button.dataset.name}?`)) {
      //      try {
      //        button.disabled = true; button.innerHTML = '<span>Deleting...</span>';
      //        await apiRequest(`/employees/${button.dataset.id}`, 'DELETE');
      //        button.closest('tr').remove();
      //        container.querySelector('#total-count').textContent = `Total: ${container.querySelectorAll('#users-tbody tr').length} users`;
      //      } catch (error) { alert(`Error: ${error.message}`); button.disabled = false; button.innerHTML = '<i class="icon-delete">🗑️</i> Delete'; }
      //    }
      //  });
      //});
    }

    container.querySelector('#new-employee-btn')?.addEventListener('click', () => router.navigate('/employees/new'));
    attachEventListeners();

  } catch (error) {
    container.innerHTML = `<div class="alert error"><h3>Loading Error</h3><p>${error.message}</p><button class="btn" onclick="window.location.reload()">Retry</button></div>`;
  }
  return container;
}
