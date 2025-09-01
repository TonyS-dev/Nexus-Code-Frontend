/**
 * @file ResetPassword.js
 * @description Reset password page component
 */
import { validateResetToken, resetPassword } from '../services/api.service.js';
import { router } from '../router/router.js';

export async function showResetPasswordPage() {
    const container = document.createElement('div');
    container.className = 'reset-password-container min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-background-primary to-primary/5 animate-fadeIn p-4';

    // Get token from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        container.innerHTML = `
            <div class="bg-background-primary p-8 rounded-xl shadow-special border border-border-color w-full max-w-md mx-auto animate-scaleIn">
                <div class="text-center">
                    <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4 mx-auto">
                        <i class="fa-solid fa-exclamation-triangle text-2xl text-red-500"></i>
                    </div>
                    <h1 class="text-2xl font-bold text-text-primary mb-2">Invalid Reset Link</h1>
                    <p class="text-text-secondary mb-6">The password reset link is missing or invalid.</p>
                    <button onclick="goToForgotPassword()" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-hover transition-all duration-300 btn-animated inline-block">
                        Request New Link
                    </button>
                </div>
            </div>
        `;
        return container;
    }

    // Show loading while validating token
    container.innerHTML = `
        <div class="bg-background-primary p-8 rounded-xl shadow-special border border-border-color w-full max-w-md mx-auto animate-scaleIn">
            <div class="text-center">
                <div class="loading-spinner-lg animate-spin mx-auto mb-4"></div>
                <p class="text-text-secondary">Validating reset link...</p>
            </div>
        </div>
    `;

    try {
        // Validate the token
        const validation = await validateResetToken(token);
        
        if (!validation.success) {
            throw new Error(validation.message || 'Invalid token');
        }

        // Render the reset form
        container.innerHTML = `
            <div class="reset-card bg-background-primary p-8 rounded-xl shadow-special border border-border-color w-full max-w-md animate-scaleIn hover-glow transition-all duration-500">
                <div class="text-center mb-8 animate-fadeInUp">
                    <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 animate-bounce mx-auto">
                        <i class="fa-solid fa-shield-halved text-2xl text-green-600"></i>
                    </div>
                    <h1 class="text-2xl font-bold text-text-primary">Reset Password</h1>
                    <p class="text-text-secondary mt-2">Enter your new password for <strong>${validation.email}</strong></p>
                </div>

                <form id="reset-password-form" class="space-y-6">
                    <div class="form-group animate-fadeInUp animate-stagger-1">
                        <label for="password" class="block text-sm font-medium text-text-secondary mb-2">
                            <i class="fa-solid fa-lock mr-2"></i>New Password
                        </label>
                        <input type="password" id="password" name="password" required minlength="6"
                               class="password-input w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary transition-all duration-300 hover:border-primary/50" 
                               placeholder="Enter new password">
                        <p class="text-xs text-text-muted mt-1">Minimum 6 characters required</p>
                    </div>

                    <div class="form-group animate-fadeInUp animate-stagger-2">
                        <label for="confirmPassword" class="block text-sm font-medium text-text-secondary mb-2">
                            <i class="fa-solid fa-lock mr-2"></i>Confirm Password
                        </label>
                        <input type="password" id="confirmPassword" name="confirmPassword" required minlength="6"
                               class="password-input w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary transition-all duration-300 hover:border-primary/50" 
                               placeholder="Confirm new password">
                    </div>

                    <!-- Password strength indicator -->
                    <div id="password-strength" class="animate-fadeInUp animate-stagger-3">
                        <div class="flex items-center justify-between text-xs text-text-muted">
                            <span>Password strength:</span>
                            <span id="strength-text">Enter password</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div id="strength-bar" class="h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                        </div>
                    </div>

                    <button type="submit" 
                            class="w-full bg-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-300 btn-animated hover-lift animate-fadeInUp animate-stagger-4">
                        <span class="btn-text">
                            <i class="fa-solid fa-key mr-2"></i>Reset Password
                        </span>
                        <span class="btn-loading hidden">
                            <i class="fa-solid fa-spinner fa-spin mr-2"></i>Resetting...
                        </span>
                    </button>
                </form>

                <div class="mt-6 text-center animate-fadeInUp animate-stagger-5">
                    <a href="/login" class="text-primary hover:text-primary-hover transition-colors text-sm">
                        <i class="fa-solid fa-arrow-left mr-2"></i>Back to Login
                    </a>
                </div>

                <!-- Success Message (initially hidden) -->
                <div id="success-message" class="hidden mt-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fadeIn">
                    <div class="flex items-center">
                        <i class="fa-solid fa-check-circle text-green-500 mr-3"></i>
                        <div>
                            <h3 class="text-sm font-medium text-green-800">Password Reset Successfully!</h3>
                            <p class="text-sm text-green-600 mt-1">Redirecting to login page...</p>
                        </div>
                    </div>
                </div>

                <!-- Error Message (initially hidden) -->
                <div id="error-message" class="hidden mt-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-fadeIn">
                    <div class="flex items-center">
                        <i class="fa-solid fa-exclamation-triangle text-red-500 mr-3"></i>
                        <div>
                            <h3 class="text-sm font-medium text-red-800">Error</h3>
                            <p class="text-sm text-red-600 mt-1" id="error-text">Something went wrong. Please try again.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Form elements
        const form = container.querySelector('#reset-password-form');
        const passwordInput = container.querySelector('#password');
        const confirmPasswordInput = container.querySelector('#confirmPassword');
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        const successMessage = container.querySelector('#success-message');
        const errorMessage = container.querySelector('#error-message');
        const errorText = container.querySelector('#error-text');
        const strengthBar = container.querySelector('#strength-bar');
        const strengthText = container.querySelector('#strength-text');

        // Password strength checker
        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            const strength = calculatePasswordStrength(password);
            updatePasswordStrength(strength);
        });

        // Password confirmation validation
        confirmPasswordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            if (confirmPassword && password !== confirmPassword) {
                confirmPasswordInput.setCustomValidity('Passwords do not match');
            } else {
                confirmPasswordInput.setCustomValidity('');
            }
        });

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const password = formData.get('password')?.trim();
            const confirmPassword = formData.get('confirmPassword')?.trim();

            // Validation
            if (!password || !confirmPassword) {
                showError('Please fill in all fields');
                return;
            }

            if (password.length < 6) {
                showError('Password must be at least 6 characters long');
                return;
            }

            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }

            hideMessages();

            try {
                // Show loading state
                submitBtn.disabled = true;
                btnText.classList.add('hidden');
                btnLoading.classList.remove('hidden');

                const response = await resetPassword(token, password, confirmPassword);

                if (response.success) {
                    showSuccess();
                    
                    // Redirect to login after success
                    setTimeout(() => {
                        router.navigate('/login');
                    }, 2000);
                } else {
                    showError(response.message || 'Failed to reset password');
                }

            } catch (error) {
                console.error('Reset password error:', error);
                showError(error.message || 'Something went wrong. Please try again.');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                btnText.classList.remove('hidden');
                btnLoading.classList.add('hidden');
            }
        });

        function calculatePasswordStrength(password) {
            if (!password) return 0;
            
            let strength = 0;
            if (password.length >= 6) strength += 25;
            if (password.length >= 10) strength += 25;
            if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
            if (/\d/.test(password)) strength += 25;
            
            return Math.min(strength, 100);
        }

        function updatePasswordStrength(strength) {
            const colors = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
            const texts = ['Weak', 'Fair', 'Good', 'Strong'];
            
            let colorIndex = Math.floor(strength / 25);
            if (colorIndex > 3) colorIndex = 3;
            
            strengthBar.style.width = `${strength}%`;
            strengthBar.className = `h-2 rounded-full transition-all duration-300 ${colors[colorIndex]}`;
            strengthText.textContent = strength === 0 ? 'Enter password' : texts[colorIndex];
        }

        function showSuccess() {
            hideMessages();
            successMessage.classList.remove('hidden');
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        function showError(message) {
            hideMessages();
            errorText.textContent = message;
            errorMessage.classList.remove('hidden');
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        function hideMessages() {
            successMessage.classList.add('hidden');
            errorMessage.classList.add('hidden');
        }

    } catch (error) {
        console.error('Token validation error:', error);
        
        container.innerHTML = `
            <div class="bg-background-primary p-8 rounded-xl shadow-special border border-border-color w-full max-w-md mx-auto animate-scaleIn">
                <div class="text-center">
                    <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4 mx-auto">
                        <i class="fa-solid fa-times-circle text-2xl text-red-500"></i>
                    </div>
                    <h1 class="text-2xl font-bold text-text-primary mb-2">Invalid or Expired Link</h1>
                    <p class="text-text-secondary mb-6">${error.message || 'The password reset link is invalid or has expired.'}</p>
                    <button onclick="goToForgotPassword()" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-hover transition-all duration-300 btn-animated inline-block">
                        Request New Link
                    </button>
                </div>
            </div>
        `;
    }

    // Add global function for navigation
    window.goToForgotPassword = () => {
        router.navigate('/forgot-password');
    };

    return container;
}