// frontend/src/views/myRequests.js

export async function showMyRequestsPage() {
  const user = auth.getUser();
  const container = document.createElement('div');
  container.className = 'content-section';

  container.innerHTML = `
    <div class="main-header">
      <h1>Mis Solicitudes</h1>
      <button id="btn-new-request" class="btn btn-primary">Nueva Solicitud</button>
    </div>
    <div class="loading">Cargando solicitudes...</div>
  `;

  try {
    const data = await apiRequest(`/requests/employee/${user.id}`);
    const requests = Array.isArray(data) ? data : [];

    const tableRows = requests.length > 0
      ? requests.map(req => {
          const tipo = TIPO_NOMBRE[req.type] || req.type;
          const fecha = new Date(req.start_date).toLocaleDateString('es-ES');
          return `
            <tr>
              <td>${fecha}</td>
              <td>${tipo}</td>
              <td><span class="status ${req.status}">${req.status}</span></td>
              <td>${req.comment || '–'}</td>
            </tr>
          `;
        }).join('')
      : `<tr><td colspan="4" class="text-center">No tienes solicitudes aún.</td></tr>`;

    container.innerHTML = `
      <div class="main-header">
        <h1>Mis Solicitudes</h1>
        <button id="btn-new-request" class="btn btn-primary">Nueva Solicitud</button>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Comentario</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;

    // ✅ Añadir calendario solo aquí, donde 'requests' existe
    if (requests.length > 0) {
      const calendarEl = document.createElement('div');
      calendarEl.style.height = '400px';
      calendarEl.style.marginTop = '20px';
      calendarEl.style.backgroundColor = 'white';
      calendarEl.style.borderRadius = '8px';
      calendarEl.style.padding = '15px';
      container.appendChild(calendarEl);
      renderCalendar(calendarEl, requests);
    }

    container.querySelector('#btn-new-request').addEventListener('click', () => {
      router.navigate('/requests/new');
    });

  } catch (error) {
    container.innerHTML = `
      <div class="main-header">
        <h1>Mis Solicitudes</h1>
        <button id="btn-new-request" class="btn btn-primary">Nueva Solicitud</button>
      </div>
      <div class="alert error">
        No se pudieron cargar tus solicitudes.
      </div>
    `;
    console.error('Error en showMyRequestsPage:', error);
  }

  return container;
}