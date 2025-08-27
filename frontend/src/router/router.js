// frontend/src/router/router.js
import Navigo from 'navigo';
import { auth } from '../services/auth.js';
import { AppLayout } from '../components/layout.js';

// Importar vistas
import { showLoginPage } from '../views/login.js';
import { showHomePage } from '../views/home.js';
import { showMyRequestsPage } from '../views/myRequests.js';
import { showNewRequestPage } from '../views/newRequest.js';
import { showManageUsersPage } from '../views/manageUsers.js';
import { showAdminRequestsPage } from '../views/adminRequests.js';
import { showManagerRequestsPage } from '../views/managerRequests.js';
import { showEmployeeHistoryPage } from '../views/employeeHistory.js';
import { renderNotFoundPage } from '../views/notFound.js';
import { renderForbiddenPage } from '../views/forbidden.js';

const appContainer = document.getElementById('app');
export const router = new Navigo('/', { hash: true });

function renderInLayout(pageComponent, title = 'Dashboard') {
  appContainer.innerHTML = '';
  const layout = AppLayout();
  const pageContent = typeof pageComponent === 'function' ? pageComponent() : pageContent;
  layout.querySelector('#app-content').appendChild(pageContent);

  const navbar = layout.querySelector('#navbar-container');
  if (navbar && navbar.setTitle) {
    navbar.setTitle(title);
  }

  appContainer.appendChild(layout);
}

const ROUTES = {
  '/home': { component: showHomePage, title: 'Inicio', requiresAuth: true },
  '/my-requests': { component: showMyRequestsPage, title: 'Mis Solicitudes', requiresAuth: true },
  '/requests/new': { component: showNewRequestPage, title: 'Nueva Solicitud', requiresAuth: true },
  '/manage-users': { component: showManageUsersPage, title: 'Gestionar Usuarios', role: 'hr', requiresAuth: true },
  '/admin-requests': { component: showAdminRequestsPage, title: 'Panel de Talento Humano', role: 'hr', requiresAuth: true },
  '/manager-requests': { component: showManagerRequestsPage, title: 'Aprobar Solicitudes', role: 'manager', requiresAuth: true },
  '/employee/history': { component: showEmployeeHistoryPage, title: 'Historial', requiresAuth: true },
  '/login': { requiresAuth: false },
  '/forbidden': { requiresAuth: false },
  '/not-found': { requiresAuth: false }
};

router.hooks({
  before: (done, match) => {
    const route = match.url;
    const config = ROUTES[route];

    if (!config) {
      done();
      return;
    }

    if (config.requiresAuth === false) {
      if (route === '/login' && auth.isAuthenticated()) {
        router.navigate('/home', { replace: true });
        done(false);
      } else {
        done();
      }
      return;
    }

    if (!auth.isAuthenticated()) {
      router.navigate('/login', { replace: true });
      done(false);
      return;
    }

    const user = auth.getUser();
    if (config.role && user.role !== config.role) {
      router.navigate('/forbidden');
      done(false);
      return;
    }

    done();
  }
});

export function setupRouter() {
  router.on({
    '/': () => {
      if (auth.isAuthenticated()) {
        renderInLayout(showHomePage, 'Inicio');
      } else {
        appContainer.innerHTML = '';
        appContainer.append(showLoginPage());
      }
    },
    '/login': () => {
      appContainer.innerHTML = '';
      appContainer.append(showLoginPage());
    },
    '/home': () => renderInLayout(showHomePage, 'Inicio'),
    '/my-requests': () => renderInLayout(showMyRequestsPage, 'Mis Solicitudes'),
    '/requests/new': () => renderInLayout(showNewRequestPage, 'Nueva Solicitud'),
    '/manage-users': () => renderInLayout(showManageUsersPage, 'Gestionar Usuarios'),
    '/admin-requests': () => renderInLayout(showAdminRequestsPage, 'Panel de Talento Humano'),
    '/manager-requests': () => renderInLayout(showManagerRequestsPage, 'Aprobar Solicitudes'),
    '/employee/history': () => renderInLayout(showEmployeeHistoryPage, 'Historial'),
    '/forbidden': () => {
      appContainer.innerHTML = '';
      appContainer.append(renderForbiddenPage());
    }
  });

  router.notFound(() => {
    appContainer.innerHTML = '';
    appContainer.append(renderNotFoundPage());
  });

  router.resolve();
}