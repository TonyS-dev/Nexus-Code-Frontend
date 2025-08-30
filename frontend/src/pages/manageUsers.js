// frontend/src/views/manageUsers.js
import { auth } from '../services/auth.service.js';
import { apiRequest } from '../services/api.service.js';
import { router } from '../router/router.js';

export async function showManageUsersPage() {
  const user = auth.getUser();
  if (user.role !== 'hr') {
    router.navigate('/forbidden');
    return document.createElement('div');
  }

  const container = document.createElement('div');
  container.className = 'content-section';

  try {
    const employees = await apiRequest('/employees');
    const rows = employees.map(emp => `
      <tr>
        <td>${emp.first_name} ${emp.last_name}</td>
        <td>${emp.email}</td>
        <td>${emp.role_name}</td>
        <td>${emp.department || '–'}</td>
        <td>
          <button class="btn-sm btn-edit" data-id="${emp.id}">Editar</button>
        </td>
      </tr>
    `).join('');

    container.innerHTML = `
      <div class="main-header">
        <h1>Gestionar Usuarios</h1>
        <button class="btn btn-primary">Nuevo Empleado</button>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Área</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  } catch (error) {
    container.innerHTML = `<div class="alert error">Error: ${error.message}</div>`;
  }

  return container;
}