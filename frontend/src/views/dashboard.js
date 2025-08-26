// frontend/src/views/dashboard.js
import { auth } from '../services/auth.js';
import { router } from '../router/router.js';

export function showDashboardPage() {

    const user = auth.getUser();
    const role = user?.role || 'employee';

    const container = document.createElement('div');
    container.style.margin = '0';
    container.style.minHeight = '100%';

    let title = 'Mis Solicitudes';
    let addBtnText = 'Nueva Solicitud';
    let tableHeaders = `
    <th>Fecha</th>
    <th>Tipo</th>
    <th>Estado</th>
    <th>Comentario</th>
    `;
    let tableRows = `
    <tr>
        <td>01/09/2025</td>
        <td>Vacaciones</td>
        <td><span class="status approved">Aprobado</span></td>
        <td>Descanso anual</td>
    </tr>
    `;
    container.innerHTML = `

    <div class="main-header">
        <h1>${title}</h1>
        <div class="search-box">
            <input type="text" placeholder="Buscar ${role === 'hr' ? 'empleado' : 'solicitud'}...">
            <button class="btn btn-primary">${addBtnText}</button>
        </div>
    </div>

    <div class="content-section">
        <table class="data-table">
        <thead>
            <tr>${tableHeaders}</tr>
        </thead>
        <tbody>
            ${tableRows}
        </tbody>
        </table>
    </div>
    `;

    setTimeout(() => {
        container.querySelectorAll('.btn-approve').forEach(btn => {
        btn.addEventListener('click', () => alert('Aprobado'));
    });
    container.querySelectorAll('.btn-reject').forEach(btn => {
        btn.addEventListener('click', () => alert('Rechazado'));
    });
    container.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => alert('Editar'));
    });
    container.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => confirm('¿Eliminar?') && alert('Eliminado'));
    });
    }, 100);

    return container;
}
