// src/views/employeeHistory.js
import { auth } from '../services/auth.js';
import { apiRequest } from '../services/api.js';

export async function showEmployeeHistoryPage() {
  const user = auth.getUser();
  const container = document.createElement('div');
  container.className = 'content-section';

  try {
    // Obtener datos del empleado y sus solicitudes
    const employee = await apiRequest(`/employees/${user.id}`);
    const requests = await apiRequest(`/requests/employee/${user.id}`);

    container.innerHTML = `
      <div class="main-header">
        <h1>Historial de ${employee.first_name} ${employee.last_name}</h1>
      </div>

      <div class="profile-card">
        <h3>Información Personal</h3>
        <p><strong>Email:</strong> ${employee.email}</p>
        <p><strong>Rol:</strong> ${employee.role_name}</p>
        <p><strong>Área:</strong> ${employee.department || '–'}</p>
        <p><strong>Fecha de ingreso:</strong> ${new Date(employee.hire_date).toLocaleDateString('es-ES')}</p>
      </div>

      <h3>Solicitudes Realizadas</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Periodo</th>
            <th>Estado</th>
            <th>Comentario</th>
          </tr>
        </thead>
        <tbody>
          ${requests.map(r => `
            <tr>
              <td>${r.type}</td>
              <td>${r.start_date} → ${r.end_date}</td>
              <td><span class="status ${r.status}">${r.status}</span></td>
              <td>${r.comment || '–'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (error) {
    container.innerHTML = `<div class="alert error">Error: ${error.message}</div>`;
  }

  return container;
}