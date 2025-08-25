// frontend/src/views/login.js

import { auth } from '../services/auth.js';
import { router } from '../router/router.js';

/**
 * Creates and returns the complete DOM element for the login page.
 * It handles the form submission and navigates on successful login.
 */
export function showLoginPage() {
    // Create the main container element
    const loginContainer = document.createElement('div');
    loginContainer.className = 'login-container';

    // Set the inner HTML for the structure
    loginContainer.innerHTML = `
      <div class="left-panel">
        <img src="/riwi.png" alt="Riwi Logo" class="riwi-logo" />
        <h2 class="form-title">Login</h2>
        <p class="form-text">Enter your account details</p>
        
        <form id="login-form">
          <div class="mb-3">
             <input type="email" id="email" class="form-control" placeholder="you@example.com" required />
          </div>
          <div class="mb-3">
              <input type="password" id="password" class="form-control" placeholder="Password" required />
          </div>
          <a href="/forgot-password" class="forgot-password" data-navigo>Forgot Password?</a>
          <button type="submit" class="btn-login">Login</button>
        </form>
        <p id="login-error" class="error-message" style="display:none; color: red; margin-top: 1rem;"></p>
      </div>

      <div class="right-panel">
          <div class="welcome-text">
            Welcome to <span class="riwi-text-gradient">Nexus</span> Portal
          </div>
      </div>
    `;

    // --- Event Handling ---
    const loginForm = loginContainer.querySelector('#login-form');
    const errorMessageElement = loginContainer.querySelector('#login-error');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorMessageElement.style.display = 'none'; // Hide previous errors

        try {
            const email = event.target.email.value;
            const password = event.target.password.value;

            await auth.login(email, password);

            // On success, tell the router to navigate to the dashboard
            router.navigate('/dashboard');
        } catch (error) {
            // Display the error message to the user
            errorMessageElement.textContent = error.message;
            errorMessageElement.style.display = 'block';
        }
    });

    // Return the fully constructed DOM element
    return loginContainer;
}
