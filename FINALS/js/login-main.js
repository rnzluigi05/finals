/*
  Login Page Script
 */

import { validators } from './modules/validation.js';

class LoginManager {
    constructor() {
        // Cache DOM elements
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('emailInput');
        this.passwordInput = document.getElementById('passwordInput');
        this.emailError = document.getElementById('emailError');
        this.passwordError = document.getElementById('passwordError');
        
        // Safety check
        if (!this.form) {
            console.warn('Login form not found');
            return;
        }

        this.submitBtn = this.form.querySelector('.btn-submit');
        this.init();
    }

    init() {
        // Real-time error clearing
        this.emailInput.addEventListener('input', () => validators.clearError(this.emailInput, this.emailError));
        this.passwordInput.addEventListener('input', () => validators.clearError(this.passwordInput, this.passwordError));

        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    validate() {
        let isValid = true;
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;

        // Email Validation
        if (!email) {
            validators.showError(this.emailInput, this.emailError, 'Email is required');
            isValid = false;
        } else if (!email.includes('@')) {
            validators.showError(this.emailInput, this.emailError, 'Email must contain @ symbol');
            isValid = false;
        } else if (!validators.isValidEmail(email)) {
            validators.showError(this.emailInput, this.emailError, 'Invalid email format');
            isValid = false;
        } else {
            validators.clearError(this.emailInput, this.emailError);
        }

        // Password Validation
        if (!password) {
            validators.showError(this.passwordInput, this.passwordError, 'Password is required');
            isValid = false;
        } else if (!validators.isValidPassword(password)) {
            validators.showError(this.passwordInput, this.passwordError, 'Password must be at least 6 characters long');
            isValid = false;
        } else {
        validators.clearError(this.passwordInput, this.passwordError);
        }

        return isValid;
    }

    handleSubmit(e) {
        e.preventDefault();

        if (this.validate()) {
            this.startLoading();
            
            // Simulate API Login Delay
            setTimeout(() => {
                this.handleSuccess();
            }, 1500);
        }
    }

    startLoading() {
        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Logging in...';
    }

    handleSuccess() {
        // Redirect to Home
        window.location.href = 'index.html'; 
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
});