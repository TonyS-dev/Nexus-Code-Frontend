// frontend/src/views/home.js
import { auth } from '../services/auth.js';
import { router } from '../router/router.js';

export function showHomePage() {
  const user = auth.getUser();
  const container = document.createElement('div');
  container.className = 'home-container';

  const actions = {
    employee: [
      { label: 'Mis Solicitudes', icon: 'list', route: '/my-requests' },
      { label: 'Nueva Solicitud', icon: 'plus-circle', route: '/requests/new' },
    ],
    manager: [
      { label: 'Mis Solicitudes', icon: 'list', route: '/my-requests' },
      { label: 'Aprobar Solicitudes', icon: 'check-circle', route: '/manager-requests' },
      { label: 'Nuevo Empleado', icon: 'user-plus', route: '/requests/new' },
    ],
    hr: [
      { label: 'Panel de Talento Humano', icon: 'users', route: '/admin-requests' },
      { label: 'Gestionar Usuarios', icon: 'cog', route: '/manage-users' },
      { label: 'Reportes', icon: 'chart-line', route: '/reports' },
    ]
  };

  const roleActions = actions[user.role] || actions.employee;

  container.innerHTML = `
    <div class="main-header">
      <h1>Welcome, ${user.first_name} ${user.last_name}</h1>
      <p>¿Qué deseas hacer hoy?</p>
    </div>

    <div class="quick-actions">
      ${roleActions.map(action => `
        <button class="action-btn" onclick="router.navigate('${action.route}')">
          <i class="fa-solid fa-${action.icon}"></i>
          <span>${action.label}</span>
        </button>
      `).join('')}
    </div>

    <div class="info-cards">
      <div class="info-card">
        <h3>Historial de Solicitudes</h3>
        <p>Consulta todas tus solicitudes pasadas y su estado.</p>
      </div>
      <div class="info-card">
        <h3>Soporte</h3>
        <p>¿Tienes dudas? Contacta al equipo de Talento Humano.</p>
      </div>
    </div>
  `;

  return container;
}