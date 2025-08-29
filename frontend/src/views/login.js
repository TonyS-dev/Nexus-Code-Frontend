import { auth } from '../services/auth.js';
import { router } from '../router/router.js';
import { toggleTheme } from '../services/theme.js';

/**
 * Enables theme switching (light/dark)
 */
function setupThemeToggle(element) {
    const themeToggle = element.querySelector('#themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

/**
 * Enables the eye icon to show/hide password
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
 * Sets up the login form and its logic
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

            console.log('Attempting login with:', email);

            // Call the function 'login' from the authentication service
            await auth.login(email, password);

            // If the previous line does not throw an error, login was successful.
            // Navigate to the dashboard.
            router.navigate('/dashboard');
        } catch (error) {
            // Shows the error message from the backend or validation.
            errorMessageElement.textContent =
                error.message || 'Login failed. Please try again.';
            errorMessageElement.style.display = 'block';
        }
    });
}

/**
 * Renders the login view
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
        <h1 class="welcome-text-right"><span class="riwi-text-gradient">Riwi</span> Nexus</h1>
        <img src="/images/login-illustration.png" alt="Login Illustration" class="full-illustration" />
      </div>
    </div>
  `;

    // 🔧 Initialize functionalities
    setupThemeToggle(loginContainer);
    setupPasswordToggle(loginContainer);
    setupLoginForm(loginContainer);

    return loginContainer;
}
