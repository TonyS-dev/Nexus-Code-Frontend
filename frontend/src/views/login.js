// frontend/src/views/login.js
import { auth } from '../services/auth.js';
import { router } from '../router/router.js';

/**
 * Creates and returns the complete DOM element for the login page,
 * including theme and password toggle functionality.
 */
export function showLoginPage() {
    const loginContainer = document.createElement('div');
    loginContainer.innerHTML = `
    <div class="login-container theme-container">
        <button id="themeToggle" class="theme-toggle" aria-label="Switch theme">
          <span class="sun">☀️</span>
          <span class="moon">🌙</span>
        </button>
        <div class="left-panel">
          <div class="login-form-container">
            <img src="/images/riwi.png" alt="Riwi Logo" class="riwi-logo" data-logo-light="/images/riwi.webp" data-logo-dark="/images/riwi.png" />
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

    // --- UI Logic ---

    // Theme Toggle Function
    function setupThemeToggle(element) {
        const themeToggle = element.querySelector('#themeToggle');
        if (!themeToggle) return;

        themeToggle.addEventListener('click', () => {
            const html = document.documentElement;
            const isLight = html.classList.toggle('theme-light');
            html.classList.toggle('theme-dark', !isLight);
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            // !Todo: Change the logo based on the theme
        });
    }

    // Password Toggle Function
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

    // --- Authentication Logic ---
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

                // Call the login function from the auth service
                await auth.login(email, password);

                // Navigate to the dashboard after successful login
                router.navigate('/dashboard');
            } catch (error) {
                errorMessageElement.textContent = error.message;
                errorMessageElement.style.display = 'block';
            }
        });
    }

    // --- Logic Initialization ---
    setupThemeToggle(loginContainer);
    setupPasswordToggle(loginContainer);
    setupLoginForm(loginContainer);

    // Finally, return the complete and functional DOM element
    return loginContainer;
}
