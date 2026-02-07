/*
 Feedback Form Module
 Handles feedback form validation and submission
 */

import { validators } from './validation.js';

class FeedbackValidator {
    constructor() {
        // Input fields
        this.nameInput = document.getElementById('fbName');
        this.emailInput = document.getElementById('fbEmail');
        this.messageInput = document.getElementById('fbMsg');
        
        // Error message elements
        this.nameError = document.getElementById('fbNameError');
        this.emailError = document.getElementById('fbEmailError');
        this.messageError = document.getElementById('fbMsgError');

        // Initialize input listeners
        this.initListeners();
    }

    initListeners() {
        // Clear errors while user types
        this.nameInput.addEventListener('input', () =>
            validators.clearError(this.nameInput, this.nameError)
        );
        this.emailInput.addEventListener('input', () =>
            validators.clearError(this.emailInput, this.emailError)
        );
        this.messageInput.addEventListener('input', () =>
            validators.clearError(this.messageInput, this.messageError)
        );
    }

    // Validate name field
    validateName() {
        const value = this.nameInput.value.trim();
        if (!value) {
            validators.showError(this.nameInput, this.nameError, 'Name is required');
            return false;
        }
        validators.clearError(this.nameInput, this.nameError);
        return true;
    }

    // Validate email field
    validateEmail() {
        const value = this.emailInput.value.trim();
        if (!value) {
            validators.showError(this.emailInput, this.emailError, 'Email is required');
            return false;
        }
        if (!value.includes('@')) {
            validators.showError(this.emailInput, this.emailError, 'Email must contain @');
            return false;
        }
        if (!validators.isValidEmail(value)) {
            validators.showError(this.emailInput, this.emailError, 'Invalid email format');
            return false;
        }
        validators.clearError(this.emailInput, this.emailError);
        return true;
    }

    // Validate message field
    validateMessage() {
        const value = this.messageInput.value.trim();
        if (!value) {
            validators.showError(this.messageInput, this.messageError, 'Message is required');
            return false;
        }
        if (value.length < 10) {
            validators.showError(this.messageInput, this.messageError, 'Message must be at least 10 characters');
            return false;
        }
        validators.clearError(this.messageInput, this.messageError);
        return true;
    }

    // Run all validations
    validateForm() {
        const v1 = this.validateName();
        const v2 = this.validateEmail();
        const v3 = this.validateMessage();
        return v1 && v2 && v3;
    }
}

class FeedbackFormHandler {
    constructor(validator) {
        // Form and validator reference
        this.form = document.getElementById('feedbackForm');
        this.validator = validator;

        // Submit button state
        this.submitBtn = this.form.querySelector('button[type="submit"]');
        this.originalBtnText = this.submitBtn.innerText;

        // Handle form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();

        // Stop submission if validation fails
        if (!this.validator.validateForm()) {
            return;
        }

        // Simulate sending state
        this.setLoading(true);
        setTimeout(() => this.handleSuccess(), 1500);
    }

    // Toggle loading state
    setLoading(isLoading) {
        if (isLoading) {
            this.submitBtn.innerHTML =
                '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
            this.submitBtn.disabled = true;
        } else {
            this.submitBtn.innerHTML = this.originalBtnText;
            this.submitBtn.disabled = false;
        }
    }

    // Handle successful submission
    handleSuccess() {
        this.submitBtn.innerHTML = '✓ Message Sent!';
        this.submitBtn.classList.add('btn-success-feedback');
        
        setTimeout(() => {
            // Reset form and clear errors
            this.form.reset();
            validators.clearError(this.validator.nameInput, this.validator.nameError);
            validators.clearError(this.validator.emailInput, this.validator.emailError);
            validators.clearError(this.validator.messageInput, this.validator.messageError);
            
            // Restore button state
            this.submitBtn.innerHTML = this.originalBtnText;
            this.submitBtn.classList.remove('btn-success-feedback');
            this.submitBtn.disabled = false;
        }, 2000);
    }
}

// Entry point for feedback form module
export function initFeedbackForm() {
    const feedbackForm = document.getElementById('feedbackForm');
    if (!feedbackForm) return;

    const validator = new FeedbackValidator();
    new FeedbackFormHandler(validator);
}
