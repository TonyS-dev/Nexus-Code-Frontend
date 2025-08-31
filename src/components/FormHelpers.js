/**
 * @file FormHelpers.js
 * @description Utility functions for forms with animations
 */

export const FormHelpers = {
    /**
     * Adds form validation with animations
     * @param {HTMLFormElement} form - Form element
     * @param {Function} onSubmit - Submit callback
     */
    addFormValidation(form, onSubmit) {
        // Ensure submit button doesn't start in a loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            // Save original text if not already saved
            if (!submitBtn.dataset.originalText) {
                submitBtn.dataset.originalText = submitBtn.innerHTML;
            }

            // If some previous code left the button with a loading class, clean it up
            if (submitBtn.classList.contains('btn-loading')) {
                submitBtn.classList.remove('btn-loading');
                submitBtn.innerHTML = submitBtn.dataset.originalText;
                submitBtn.disabled = false;
            }
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Use the previously captured submit button reference
            const btn = submitBtn || form.querySelector('button[type="submit"]');
            if (btn) {
                const originalText = btn.dataset.originalText || btn.innerHTML;
                try {
                    btn.disabled = true;
                    btn.classList.add('btn-loading');
                    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Submitting...';

                    await onSubmit(new FormData(form));
                } catch (error) {
                    console.error('Form submission error:', error);
                    throw error;
                } finally {
                    // Reset button to its original state
                    btn.disabled = false;
                    btn.classList.remove('btn-loading');
                    btn.innerHTML = originalText;
                }
            } else {
                await onSubmit(new FormData(form));
            }
        });
    },

    /**
     * Adds form field animations
     * @param {HTMLFormElement} form - Form element
     */
    addFieldAnimations(form) {
        const fields = form.querySelectorAll('.form-group, form > div');
        fields.forEach((field, index) => {
            field.classList.add('animate-fadeInUp', `animate-stagger-${(index % 4) + 1}`);
        });
    },

    /**
     * Shows form validation error
     * @param {string} message - Error message
     * @param {HTMLElement} container - Container to show error in
     */
    showValidationError(message, container) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'validation-error animate-fadeIn animate-bounce';
        errorDiv.innerHTML = `
            <i class="fa-solid fa-exclamation-triangle mr-2"></i>
            ${message}
        `;
        
        // Remove existing errors
        const existingError = container.querySelector('.validation-error');
        if (existingError) {
            existingError.remove();
        }
        
        container.insertBefore(errorDiv, container.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.classList.add('animate-fadeOut');
                setTimeout(() => errorDiv.remove(), 300);
            }
        }, 5000);
    },

    /**
     * Shows form success message
     * @param {string} message - Success message
     * @param {HTMLElement} container - Container to show message in
     */
    showSuccess(message, container) {
        const successDiv = document.createElement('div');
        successDiv.className = 'validation-success animate-fadeIn';
        successDiv.innerHTML = `
            <i class="fa-solid fa-check-circle mr-2"></i>
            ${message}
        `;
        
        container.insertBefore(successDiv, container.firstChild);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.classList.add('animate-fadeOut');
                setTimeout(() => successDiv.remove(), 300);
            }
        }, 3000);
    }
};