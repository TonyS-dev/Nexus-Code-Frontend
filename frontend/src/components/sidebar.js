// frontend/src/components/sidebar.js
import { auth } from '../services/auth.js';
import { router } from '../router/router.js';

export function Sidebar() {
  const user = auth.getUser();

  if (!user) {
    console.warn('No hay usuario autenticado');
    return document.createElement('aside');
  }

  const sidebar = document.createElement('aside');
  sidebar.classList.add('sidebar');

  const menuItems = {
    employee: [
      { href: '/home', icon: 'house', label: 'Inicio' },
      { href: '/my-requests', icon: 'list', label: 'Mis Solicitudes' },
      { href: '/requests/new', icon: 'plus-circle', label: 'Nueva Solicitud' }
    ],
    manager: [
      { href: '/home', icon: 'house', label: 'Inicio' },
      { href: '/my-requests', icon: 'list', label: 'Mis Solicitudes' },
      { href: '/requests/new', icon: 'plus-circle', label: 'Nueva Solicitud' },
      { href: '/manager-requests', icon: 'check-circle', label: 'Aprobar Solicitudes' }
    ],
    hr: [
      { href: '/home', icon: 'house', label: 'Inicio' },
      { href: '/my-requests', icon: 'list', label: 'Mis Solicitudes' },
      { href: '/requests/new', icon: 'plus-circle', label: 'Nueva Solicitud' },
      { href: '/admin-requests', icon: 'users', label: 'Panel de Talento Humano' },
      { href: '/manage-users', icon: 'cog', label: 'Gestionar Usuarios' }
    ]
  };

  const menu = menuItems[user.role] || menuItems.employee;

  const menuHTML = menu.map(item => `
    <li><a href="${item.href}" data-navigo><i class="fa-solid fa-${item.icon}"></i> ${item.label}</a></li>
  `).join('');

  sidebar.innerHTML = `
    <div class="sidebar-header">
      <img src="https://i.pravatar.cc/60?u=${user.email}" alt="Perfil">
      <h3>${user.first_name} ${user.last_name}</h3>
      <p>${user.role_name || 'Empleado'}</p>
    </div>
    <div class="sidebar-menu">
      <ul>
        ${menuHTML}
      </ul>
    </div>
  `;

  // ✅ Actualizar activo después de que Navigo lo procese
  setTimeout(() => {
    const currentPath = window.location.hash.replace('#', '') || '/';
    const links = sidebar.querySelectorAll('a[data-navigo]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      const parent = link.parentElement;
      if (href === currentPath) {
        parent.classList.add('active');
      } else {
        parent.classList.remove('active');
      }
    });
  }, 100);

  return sidebar;
}