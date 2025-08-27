// frontend/src/views/login.js
import { auth } from '../services/auth.js';
import { router } from '../router/router.js';
import { toggleTheme } from '../services/theme.js';

/**
 * Activa el cambio de tema (light/dark)
 */
function setupThemeToggle(element) {
  const themeToggle = element.querySelector('#themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}

/**
 * Activa el ojo para mostrar/ocultar contraseña
 */
function setupPasswordToggle(element) {
  const togglePassword = element.querySelector('#togglePassword');
  const passwordInput = element.querySelector('#password');
  if (!togglePassword || !passwordInput) return;

  togglePassword.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePassword.src = isPassword
      ? '/images/hidden.png'
      : '/images/visible.png';
  });
}

/**
 * Configura el formulario de login y su lógica
 */
function setupLoginForm(element) {
  const loginForm = element.querySelector('#loginForm');
  const errorMessageElement = element.querySelector('#login-error');
  if (!loginForm) return;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessageElement.style.display = 'none';

    try {
      const email = element.querySelector('#email').value.trim();
      const password = element.querySelector('#password').value;

      // 🔍 Validación básica
      if (!email || !password) {
        throw new Error('Por favor, completa todos los campos');
      }

      // ✅ Simulación de autenticación (en producción: llamada al backend)
      // Aquí puedes agregar una API real después
      console.log('Intentando login con:', email);

      // 🎯 Determinar rol por el correo
      let role = 'employee';
      let roleName = 'Empleado';

      if (email.includes('hr@') || email.includes('talento@')) {
        role = 'hr';
        roleName = 'Talento Humano';
      } else if (email.includes('manager@') || email.includes('lider@')) {
        role = 'manager';
        roleName = 'Líder de equipo';
      }

      // 📦 Datos del usuario (simulados, en producción vienen del backend)
      const userData = {
        id: Date.now().toString(), // temporal
        first_name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        last_name: '',
        email,
        role,
        role_name: roleName
      };

      // ✅ 1. Guardar usuario y token
      auth.login(userData);

      // ✅ 2. Navegar al home
      router.navigate('/home');

    } catch (error) {
      // Mostrar error en pantalla
      errorMessageElement.textContent = error.message || 'Error al iniciar sesión';
      errorMessageElement.style.display = 'block';
    }
  });
}

/**
 * Renderiza la vista de login
 */
export function showLoginPage() {
  const loginContainer = document.createElement('div');
  const currentTheme = localStorage.getItem('theme') || 'dark';
  const initialLogoSrc =
    currentTheme === 'light'
      ? '/images/logo-light.webp'
      : '/images/logo-dark.png';

  loginContainer.innerHTML = `
    <div class="login-container theme-container">
      <button id="themeToggle" class="theme-toggle" aria-label="Switch theme">
        <span class="sun">☀️</span>
        <span class="moon">🌙</span>
      </button>
      <div class="left-panel">
        <div class="login-form-container">
          <img 
            src="${initialLogoSrc}"
            alt="Riwi Logo" 
            class="riwi-logo" 
            data-logo-light="/images/logo-light.webp" 
            data-logo-dark="/images/logo-dark.png" 
          />
          <h1 class="form-title">Welcome Back!</h1>
          <p class="form-text">Please enter your details to sign in.</p>
          <form id="loginForm">
            <input 
              type="email" 
              id="email" 
              class="form-control" 
              placeholder="Email" 
              required 
            />
            <div class="password-field">
              <input 
                type="password" 
                id="password" 
                class="form-control" 
                placeholder="Password" 
                required 
              />
              <img 
                src="/images/visible.png" 
                alt="Show password" 
                id="togglePassword" 
                class="toggle-password-icon" 
              />
            </div>
            <a href="#" class="forgot-password">Forgot password?</a>
            <button type="submit" class="btn-login">Login</button>
          </form>
          <p id="login-error" class="error-message" style="display: none; color: red; margin-top: 1rem;"></p>
        </div>
      </div>
      <div class="right-panel">
        <h1 class="welcome-text-right"><span class="riwi-text-gradient">Riwi</span> Team</h1>
        <img src="/images/login-illustration.png" alt="Login Illustration" class="full-illustration" />
      </div>
    </div>
  `;

  // 🔧 Inicializar funcionalidades
  setupThemeToggle(loginContainer);
  setupPasswordToggle(loginContainer);
  setupLoginForm(loginContainer);

  return loginContainer;
}