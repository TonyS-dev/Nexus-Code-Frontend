/**
 * @file Login.js
 * @description Renders the login page and handles the authentication process.
 */
import { auth } from '../services/auth.service.js';
import { router } from '../router/router.js';
import { toggleTheme } from '../services/theme.service.js';

/**
 * Sets up the event listener for the login form submission.
 * @param {HTMLElement} element - The container element of the login page.
 */
function setupLoginForm(element) {
    const loginForm = element.querySelector('#loginForm');
    const errorMessageElement = element.querySelector('#login-error');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = loginForm.querySelector('button[type="submit"]');
        errorMessageElement.style.display = 'none';
        submitButton.disabled = true;
        submitButton.textContent = 'Logging in...';

        try {
            const email = element.querySelector('#email').value.trim();
            const password = element.querySelector('#password').value;

            if (!email || !password) {
                throw new Error('Please fill in all fields.');
            }

            await auth.login(email, password);
            router.navigate('/dashboard');
        } catch (error) {
            errorMessageElement.textContent =
                error.message || 'Login failed. Please try again.';
            errorMessageElement.style.display = 'block';
            submitButton.disabled = false;
            submitButton.textContent = 'Login';
        }
    });
}

/**
 * Renders the complete login view.
 * @returns {HTMLElement} The login page container element.
 */
export function showLoginPage() {
    const loginContainer = document.createElement('div');
    const initialLogoSrc = '/images/logo-dark.png'; // Start with a default, theme service will correct it

    loginContainer.innerHTML = `
    <div class="login-container">
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
            <input type="email" id="email" class="form-control" placeholder="Email" required />
            <div class="password-field">
              <input type="password" id="password" class="form-control" placeholder="Password" required />
            </div>
            <button type="submit" class="btn-login">Login</button>
          </form>
          <p id="login-error" class="error-message" style="display: none;"></p>
          <div class="mt-6 text-center text-sm text-text-secondary animate-fadeInUp animate-stagger-4">
            <p>Don't have an account? Contact your administrator.</p>
            <a href="/forgot-password" class="text-primary hover:text-primary-hover transition-colors font-medium block mt-2">
                <i class="fa-solid fa-key mr-1"></i>Forgot your password?
            </a>
          </div>
        </div>
      </div>
      <div class="right-panel">
        <h1 class="welcome-text-right"><span class="riwi-text-gradient">Riwi</span> Nexus</h1>
        <img src="/images/login-illustration.png" alt="Login Illustration" class="full-illustration" />
      </div>
    </div>
  `;

    // Initialize event listeners for elements inside this component.
    loginContainer
        .querySelector('#themeToggle')
        .addEventListener('click', toggleTheme);
    setupLoginForm(loginContainer);

    return loginContainer;
}
