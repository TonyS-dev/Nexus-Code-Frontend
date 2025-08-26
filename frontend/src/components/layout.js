// frontend/src/components/layout.js
import { Sidebar } from './sidebar.js';
import { Navbar } from './navbar.js';

export function AppLayout() {
    console.log('AppLayout: creado');

    const appContainer = document.createElement('div');
    appContainer.className = 'app-container';
    appContainer.style.display = 'flex';
    appContainer.style.height = '100vh';
    appContainer.style.width = '100vw';
    appContainer.style.overflow = 'hidden';

    appContainer.innerHTML = `
        <div id="sidebar-container"></div>
        <div class="main-panel">
            <header id="navbar-container"></header>
            <main id="app-content" style="flex: 1; overflow-y: auto; padding: 20px; background: #f9f9f9;"></main>
        </div>
    `;
    try {

        const sidebarElement = Sidebar();  // ← Ahora sí está definido
        const sidebarContainer = appContainer.querySelector('#sidebar-container');
        sidebarContainer.appendChild(sidebarElement);
        sidebarElement.style.width = '240px';
        sidebarElement.style.minWidth = '240px';
        sidebarElement.style.boxSizing = 'border-box';
        console.log('Sidebar inyectado correctamente');
    } catch (error) {
        console.error('Error al inyectar Sidebar:', error);
    }

    try {

        const navbarElement = Navbar();  // ← Ahora sí está definido
        const navbarContainer = appContainer.querySelector('#navbar-container');
        navbarContainer.appendChild(navbarElement);
        console.log('Navbar inyectado correctamente');
    } catch (error) {
    console.error('Error al inyectar Navbar:', error);
    }

    return appContainer;
}
