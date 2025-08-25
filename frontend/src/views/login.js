// frontend/src/views/login.js
import { auth } from '../services/auth.js';
import { router } from '../router/router.js';
import { toggleTheme } from '../services/theme.js';

// --- Helper Functions (defined outside the component) ---

/**
 * Attaches the theme toggle event listener.
 * @param {HTMLElement} element - The parent element containing the button.
 */
function setupThemeToggle(element) {
    const themeToggle = element.querySelector('#themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

/**
 * Attaches the password visibility toggle event listener.
 * @param {HTMLElement} element - The parent element containing the inputs.
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
 * Attaches the form submission logic for login.
 * @param {HTMLElement} element - The parent element containing the form.
 */
function setupLoginForm(element) {
    const loginForm = element.querySelector('#loginForm');
    const errorMessageElement = element.querySelector('#login-error');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessageElement.style.display = 'none';
        try {
            const email = element.querySelector('#email').value;
            const password = element.querySelector('#password').value;

            await auth.login(email, password);
            router.navigate('/dashboard');
        } catch (error) {
            errorMessageElement.textContent = error.message;
            errorMessageElement.style.display = 'block';
        }
    });
}

// --- Main Component Function ---

/**
 * Creates and returns the complete DOM element for the login page,
 * including theme and password toggle functionality.
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
                alt="Nexus Code Logo" 
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
                <img src="/images/visible.png" alt="Show password" id="togglePassword" class="toggle-password-icon" />
              </div>
              <a href="#" class="forgot-password">Forgot password?</a>
              <button type="submit" class="btn-login">Login</button>
            </form>
            <p id="login-error" class="error-message" style="display:none; color: red; margin-top: 1rem;"></p>
          </div>
        </div>
        <div class="right-panel">
          <h1 class="welcome-text-right"><span class="riwi-text-gradient">Riwi</span> Team</h1>
          <img src="/images/login-illustration.png" alt="Riwi Team Illustration" class="full-illustration" />
        </div>
    </div>
    `;

    // Call the helper functions to attach all logic
    setupThemeToggle(loginContainer);
    setupPasswordToggle(loginContainer);
    setupLoginForm(loginContainer);

    // Finally, return the complete and functional DOM element
    return loginContainer;
}
