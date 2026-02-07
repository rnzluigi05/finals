/*
Validation Module
Exports functions for validating inputs
Used by: Login, Signup, and Feedback
 */

export const validators = {
    
    // Checks if email format is valid
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Checks password strength (min 6 chars)
    isValidPassword: (password) => {
        return password && password.length >= 6;
    },

    // Helper to show error on an input field
    showError: (inputElement, errorElement, message) => {
        errorElement.innerText = message;
        inputElement.classList.add('is-invalid');
    },

    //Helper to clear error
    clearError: (inputElement, errorElement) => {
        errorElement.innerText = '';
        inputElement.classList.remove('is-invalid');
    }
};