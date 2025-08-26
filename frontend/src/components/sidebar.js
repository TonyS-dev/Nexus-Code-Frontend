// src/components/sidebar.js
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

    sidebar.innerHTML = `
    <div class="sidebar-header">
        <img src="https://i.pravatar.cc/60?u=${user.email}" alt="Perfil">
        <h3>${user.first_name} ${user.last_name}</h3>
        <p>${user.role_name || 'Empleado'}</p>
    </div>

    <div class="sidebar-menu">
        <ul>
            <li class="active"><a href="/dashboard" data-navigo><i class="fa-solid fa-house"></i> Dashboard</a></li>
            <li><a href="/requests/new" data-navigo><i class="fa-solid fa-plus-circle"></i> Nueva Solicitud</a></li>
            <li><a href="/requests/my" data-navigo><i class="fa-solid fa-list"></i> Mis Solicitudes</a></li>
        </ul>
    </div>

    `;

    return sidebar;
}