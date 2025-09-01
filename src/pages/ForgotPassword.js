/**
 * @file ForgotPassword.js
 * @description Forgot password page component
 */
import { requestPasswordReset } from '../services/api.service.js';
import { router } from '../router/router.js';

export async function showForgotPasswordPage() {
    const container = document.createElement('div');
    container.className = 'reset-password-container min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-background-primary to-primary/5 animate-fadeIn p-4';

    container.innerHTML = `
        <div class="reset-card bg-background-primary p-8 rounded-xl shadow-special border border-border-color w-full max-w-md animate-scaleIn">
            <div class="text-center mb-8 animate-fadeInUp">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 mx-auto">
                    <i class="fa-solid fa-envelope text-2xl text-blue-600"></i>
                </div>
                <h1 class="text-2xl font-bold text-text-primary">Forgot Password?</h1>
                <p class="text-text-secondary mt-2">Enter your email address and we'll send you a reset link</p>
            </div>

            <form id="forgot-password-form" class="space-y-6">
                <div class="form-group animate-fadeInUp animate-stagger-1">
                    <label for="email" class="block text-sm font-medium text-text-secondary mb-2">
                        <i class="fa-solid fa-envelope mr-2"></i>Email Address
                    </label>
                    <input type="email" id="email" name="email" required
                           class="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background-primary text-text-primary transition-all duration-300 hover:border-primary/50" 
                           placeholder="Enter your email address">
                </div>

                <button type="submit" 
                        class="w-full bg-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-300 btn-animated hover-lift animate-fadeInUp animate-stagger-2">
                    <span class="btn-text">
                        <i class="fa-solid fa-paper-plane mr-2"></i>Send Reset Link
                    </span>
                    <span class="btn-loading hidden">
                        <i class="fa-solid fa-spinner fa-spin mr-2"></i>Sending...
                    </span>
                </button>
            </form>

            <div class="mt-6 text-center animate-fadeInUp animate-stagger-3">
                <a href="/login" class="text-primary hover:text-primary-hover transition-colors text-sm">
                    <i class="fa-solid fa-arrow-left mr-2"></i>Back to Login
                </a>
            </div>

            <!-- Success Message -->
            <div id="success-message" class="hidden mt-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fadeIn">
                <div class="flex items-center">
                    <i class="fa-solid fa-check-circle text-green-500 mr-3"></i>
                    <div>
                        <h3 class="text-sm font-medium text-green-800">Reset Link Sent!</h3>
                        <p class="text-sm text-green-600 mt-1">Check your email for the password reset link.</p>
                    </div>
                </div>
            </div>

            <!-- Error Message -->
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
    const form = container.querySelector('#forgot-password-form');
    const emailInput = container.querySelector('#email');
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const successMessage = container.querySelector('#success-message');
    const errorMessage = container.querySelector('#error-message');
    const errorText = container.querySelector('#error-text');

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const email = formData.get('email')?.trim();

        if (!email) {
            showError('Please enter your email address');
            return;
        }

        hideMessages();

        try {
            // Show loading state
            submitBtn.disabled = true;
            btnText.classList.add('hidden');
            btnLoading.classList.remove('hidden');

            const response = await requestPasswordReset(email);

            if (response.success !== false) {
                showSuccess();
                emailInput.value = '';
            } else {
                showError(response.message || 'Failed to send reset link');
            }

        } catch (error) {
            console.error('Forgot password error:', error);
            showError(error.message || 'Something went wrong. Please try again.');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.classList.remove('hidden');
            btnLoading.classList.add('hidden');
        }
    });

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

    return container;
}