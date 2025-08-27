// frontend/src/views/adminRequests.js
import { auth } from '../services/auth.js';
import { apiRequest } from '../services/api.js';

export async function showAdminRequestsPage() {
  const user = auth.getUser();
  if (user.role !== 'hr') return document.createElement('div');

  const container = document.createElement('div');
  container.className = 'content-section';

  try {
    const requests = await apiRequest('/requests/pending');
    const rows = requests.map(req => `
      <tr>
        <td>${req.employee?.first_name} ${req.employee?.last_name}</td>
        <td>${req.type}</td>
        <td>${req.start_date} → ${req.end_date}</td>
        <td><span class="status pending">Pendiente</span></td>
        <td>
          <button class="btn-sm btn-approve" data-id="${req.id}">Aprobar</button>
          <button class="btn-sm btn-reject" data-id="${req.id}">Rechazar</button>
        </td>
      </tr>
    `).join('');

    container.innerHTML = `
      <div class="main-header">
        <h1>Solicitudes Pendientes (Talento Humano)</h1>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Empleado</th>
            <th>Tipo</th>
            <th>Periodo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;

    // Eventos
    setTimeout(() => {
      container.querySelectorAll('.btn-approve').forEach(btn => {
        btn.addEventListener('click', async () => {
          await apiRequest(`/requests/${btn.dataset.id}/approve`, 'POST');
          alert('Aprobado');
          router.navigate('/admin-requests');
        });
      });
      container.querySelectorAll('.btn-reject').forEach(btn => {
        btn.addEventListener('click', async () => {
          await apiRequest(`/requests/${btn.dataset.id}/reject`, 'POST');
          alert('Rechazado');
          router.navigate('/admin-requests');
        });
      });
    }, 100);

  } catch (error) {
    container.innerHTML = `<div class="alert error">Error: ${error.message}</div>`;
  }

  return container;
}