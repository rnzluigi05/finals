/*
 Signup Page Script
 */

import { validators } from './modules/validation.js';

class SignupValidator {
    constructor() {
        // Input Fields
        this.firstNameInput = document.getElementById('firstNameInput');
        this.lastNameInput = document.getElementById('lastNameInput');
        this.emailInput = document.getElementById('emailInput');
        this.passwordInput = document.getElementById('passwordInput');
        this.confirmPasswordInput = document.getElementById('confirmPasswordInput');
        this.birthdateInput = document.getElementById('birthdateInput');
        this.genderInput = document.getElementById('genderInput');

        // Error Message Elements
        this.firstNameError = document.getElementById('firstNameError');
        this.lastNameError = document.getElementById('lastNameError');
        this.emailError = document.getElementById('emailError');
        this.passwordError = document.getElementById('passwordError');
        this.confirmError = document.getElementById('confirmPasswordError');
        this.birthdateError = document.getElementById('birthdateError');
        this.genderError = document.getElementById('genderError');

        // Safety Check
        if (!this.firstNameInput || !this.emailInput) {
            console.warn('Some form inputs not found');
            return;
        }

        this.initListeners();
    }

    initListeners() {
        // Helper to bind validation on blur and clear on input
        const bind = (input, errorEl, validateFn) => {
            if (input) {
                input.addEventListener('blur', validateFn.bind(this));
                input.addEventListener('input', () => validators.clearError(input, errorEl));
            }
        };

        bind(this.firstNameInput, this.firstNameError, this.validateFirstName);
        bind(this.lastNameInput, this.lastNameError, this.validateLastName);
        bind(this.emailInput, this.emailError, this.validateEmail);
        bind(this.passwordInput, this.passwordError, this.validatePassword);
        bind(this.confirmPasswordInput, this.confirmError, this.validateConfirmPassword);
        
        if (this.birthdateInput) {
            this.birthdateInput.addEventListener('blur', () => this.validateBirthdate());
            this.birthdateInput.addEventListener('change', () => validators.clearError(this.birthdateInput, this.birthdateError));
        }
        
        if (this.genderInput) {
            this.genderInput.addEventListener('change', () => validators.clearError(this.genderInput, this.genderError));
        }
    }

    validateFirstName() {
        const val = this.firstNameInput.value.trim();
        if (!val) {
            validators.showError(this.firstNameInput, this.firstNameError, 'First name is required');
            return false;
        }
        return true;
    }

    validateLastName() {
        const val = this.lastNameInput.value.trim();
        if (!val) {
            validators.showError(this.lastNameInput, this.lastNameError, 'Last name is required');
            return false;
        }
        return true;
    }

    validateEmail() {
        const val = this.emailInput.value.trim();
        if (!val) {
            validators.showError(this.emailInput, this.emailError, 'Email is required');
            return false;
        }
        if (!validators.isValidEmail(val)) {
            validators.showError(this.emailInput, this.emailError, 'Invalid email address');
            return false;
        }
        return true;
    }

    validatePassword() {
        const val = this.passwordInput.value;
        if (!val) {
            validators.showError(this.passwordInput, this.passwordError, 'Password is required');
            return false;
        }
        if (!validators.isValidPassword(val)) {
            validators.showError(this.passwordInput, this.passwordError, 'Must be at least 6 characters');
            return false;
        }
        return true;
    }

    validateConfirmPassword() {
        const password = this.passwordInput.value;
        const confirm = this.confirmPasswordInput.value;

        if (!confirm) {
            validators.showError(this.confirmPasswordInput, this.confirmError, 'Please confirm password');
            return false;
        }
        if (password !== confirm) {
            validators.showError(this.confirmPasswordInput, this.confirmError, 'Passwords do not match');
            return false;
        }
        return true;
    }

    validateBirthdate() {
        const val = this.birthdateInput.value;
        if (!val) {
            validators.showError(this.birthdateInput, this.birthdateError, 'Birthdate is required');
            return false;
        }

        // Calculate Age
        const today = new Date();
        const birthDate = new Date(val);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 1) {
            validators.showError(this.birthdateInput, this.birthdateError, 'Invalid age - must be at least 1 year old');
            return false;
        }
        return true;
    }

    validateGender() {
        if (!this.genderInput.value) {
            validators.showError(this.genderInput, this.genderError, 'Please select a gender');
            return false;
        }
        return true;
    }

    validateForm() {
        // Run all validations to ensure UI shows all errors
        const v1 = this.validateFirstName();
        const v2 = this.validateLastName();
        const v3 = this.validateEmail();
        const v4 = this.validatePassword();
        const v5 = this.validateConfirmPassword();
        const v6 = this.validateBirthdate();
        const v7 = this.validateGender();
        
        return v1 && v2 && v3 && v4 && v5 && v6 && v7;
    }
}

class SignupFormHandler {
    constructor(validator) {
        this.form = document.getElementById('signupForm');
        this.validator = validator;
        
        if (!this.form) return;
        
        this.submitBtn = this.form.querySelector('.btn-submit');
        this.originalBtnText = this.submitBtn.innerText;
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Initialize Bootstrap Modal
        const modalElement = document.getElementById('successModal');
        if (modalElement) {
            this.successModal = new bootstrap.Modal(modalElement);
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        if (!this.validator.validateForm()) {
            // Scroll to the first error for better UX
            const firstError = this.form.querySelector('.is-invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }

        // Proceed with signup
        this.setLoading(true);

        // Simulate API call
        setTimeout(() => {
            this.completeSignup();
        }, 1500);
    }

    setLoading(isLoading) {
        if (isLoading) {
            this.submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Creating Account...';
            this.submitBtn.disabled = true;
        } else {
            this.submitBtn.innerHTML = this.originalBtnText;
            this.submitBtn.disabled = false;
        }
    }

    completeSignup() {
        this.setLoading(false);
        
        // Show success modal or fallback
        if (this.successModal) {
            this.successModal.show();
    
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            alert('Account Created Successfully!');
            window.location.href = 'login.html';
        }
    }
}

// Initialize Module
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Signup Module...');
    const validator = new SignupValidator();
    new SignupFormHandler(validator);
});