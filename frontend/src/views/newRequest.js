// frontend/src/views/newRequest.js
import { auth } from '../services/auth.js';
import { apiRequest } from '../services/api.js';
import { router } from '../router/router.js';

export function showNewRequestPage() {
  const container = document.createElement('div');
  container.className = 'content-section';

  container.innerHTML = `
    <div class="main-header">
      <h1>Nueva Solicitud</h1>
      <button class="btn btn-secondary" onclick="router.navigate('/my-requests')">Volver</button>
    </div>

    <form id="form-new-request" class="form-grid">
      <div class="form-group">
        <label>Tipo de solicitud *</label>
        <select id="request-type" required>
          <option value="">Seleccionar...</option>
          <option value="vacation">Vacaciones</option>
          <option value="personal">Permiso Personal</option>
          <option value="medical">Permiso Médico</option>
          <option value="compensatory">Día Compensatorio</option>
          <option value="maternity">Licencia de Maternidad</option>
          <option value="paternity">Licencia de Paternidad</option>
          <option value="labor-certificate">Certificado Laboral</option>
          <option value="severance">Constancia de Cesantías</option>
        </select>
      </div>

      <div class="form-group">
        <label>Fecha de inicio *</label>
        <input type="date" id="start-date" required />
      </div>

      <div class="form-group">
        <label>Fecha de fin *</label>
        <input type="date" id="end-date" required />
      </div>

      <div class="form-group full-width">
        <label>Comentario (opcional)</label>
        <textarea id="comment" rows="4" placeholder="Detalles adicionales..."></textarea>
      </div>

      <div class="form-group full-width">
        <label>Adjuntar soporte (PDF, imagen)</label>
        <input type="file" id="attachment" accept=".pdf,.jpg,.png,.jpeg" />
      </div>

      <div class="form-actions">
        <button type="submit" form="form-new-request" class="btn btn-primary">Enviar Solicitud</button>
        <button type="button" onclick="router.navigate('/my-requests')" class="btn btn-secondary">Cancelar</button>
      </div>
    </form>
  `;

  //Se maneja form
  container.querySelector('#form-new-request').addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = auth.getUser();
    const type = container.querySelector('#request-type').value;
    const startDate = container.querySelector('#start-date').value;
    const endDate = container.querySelector('#end-date').value;
    const comment = container.querySelector('#comment').value;
    const file = container.querySelector('#attachment').files[0];

    // 🔹 Validación: fechas
    if (new Date(endDate) < new Date(startDate)) {
      alert('La fecha de fin no puede ser anterior a la de inicio.');
      return;
    }

    // 🔹 Validación: vacaciones (solo si es de tipo "vacation")
    if (type === 'vacation') {
      try {
        const balance = await apiRequest(`/vacation-balance/${user.id}`);
        const start = new Date(startDate);
        const end = new Date(endDate);
        const daysRequested = Math.ceil((end - start) / 86400000) + 1; // +1 porque es inclusivo

        if (daysRequested > balance.available) {
          alert(`Solo tienes ${balance.available} días de vacaciones disponibles.`);
          return;
        }
      } catch (error) {
        alert('No se pudo verificar tu saldo de vacaciones. Intenta más tarde.');
        console.error('Error al obtener saldo de vacaciones:', error);
        return;
      }
    }

    // ✅ Preparar datos para enviar
    const requestData = {
      type,
      start_date: startDate,
      end_date: endDate,
      comment: comment || null,
      employee_id: user.id
    };

    const formData = new FormData();
    Object.keys(requestData).forEach(key => {
      if (requestData[key] !== null) formData.append(key, requestData[key]);
    });
    if (file) formData.append('attachment', file);

    try {
      await apiRequest('/requests', 'POST', Object.fromEntries(formData));
      alert('Solicitud enviada correctamente');
      router.navigate('/my-requests');
    } catch (error) {
      alert('Error al enviar la solicitud: ' + (error.message || 'Inténtalo más tarde'));
    }
  });

  return container;
}