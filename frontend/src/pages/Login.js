/**
 * @file Login.js
 * @description Renders the login page and handles the authentication process.
 */
import { auth } from '../services/auth.service.js';
import { router } from '../router/router.js';
import { toggleTheme, initializeTheme } from '../services/theme.service.js';

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
        errorMessageElement.style.display = 'none';

        try {
            const email = element.querySelector('#email').value.trim();
            const password = element.querySelector('#password').value;

            if (!email || !password) {
                throw new Error('Please fill in all fields.');
            }

            // Await the login process from the auth service.
            await auth.login(email, password);

            // On success, navigate to the main application dashboard.
            router.navigate('/dashboard');
        } catch (error) {
            errorMessageElement.textContent =
                error.message || 'Login failed. Please try again.';
            errorMessageElement.style.display = 'block';
        }
    });
}

/**
 * Renders the complete login view.
 * @returns {HTMLElement} The login page container element.
 */
export function showLoginPage() {
    const loginContainer = document.createElement('div');
    const initialLogoSrc = document.documentElement.classList.contains(
        'theme-light'
    )
        ? '/images/logo-light.webp'
        : '/images/logo-dark.png';

    loginContainer.innerHTML = `
    <div class="login-container">
      <button id="themeToggle" class="theme-toggle" aria-label="Switch theme">
        <span class="sun" style="display: none;">☀️</span>
        <span class="moon" style="display: none;">🌙</span>
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
        </div>
      </div>
      <div class="right-panel">
        <h1 class="welcome-text-right"><span class="riwi-text-gradient">Riwi</span> Nexus</h1>
        <img src="/images/login-illustration.png" alt="Login Illustration" class="full-illustration" />
      </div>
    </div>
  `;

    // Initialize functionalities for this page.
    loginContainer
        .querySelector('#themeToggle')
        .addEventListener('click', toggleTheme);
    setupLoginForm(loginContainer);

    // Re-initialize theme elements specifically for this isolated page
    initializeTheme();

    return loginContainer;
}
