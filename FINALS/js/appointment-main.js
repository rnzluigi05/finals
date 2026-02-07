/*
Appointment Booking
 Handles appointment scheduling, time slots, pricing
 */

// Service configuration: Duration & Price 
const SERVICE_CONFIG = {
    'Braces': { duration: '30-50 Minutes', price: '₱5,000 - ₱15,000' },
    'Teeth Cleaning': { duration: '20-30 Minutes', price: '₱500 - ₱1,500' },
    'Root Canal': { duration: '20-40 Minutes', price: '₱3,000 - ₱8,000' },
    'Extraction': { duration: '10-20 Minutes', price: '₱1,000 - ₱3,000' }
};

class AppointmentBooking {
    constructor() {
        // DOM Elements
        this.form = document.getElementById('appointmentForm');
        this.serviceSelect = document.getElementById('appService');
        this.dateSelector = document.getElementById('dateSelector');
        this.contactInput = document.getElementById('appContact');
        this.bookBtn = document.getElementById('bookBtn');
        this.timeSlotContainer = document.getElementById('timeSlotContainer');
        
        // Initialize Bootstrap Modal safely
        const modalEl = document.getElementById('successModal');
        this.successModal = modalEl ? new bootstrap.Modal(modalEl) : null;
        
        // Display Elements
        this.display = {
            duration: document.getElementById('appDuration'),
            price: document.getElementById('appPrice'),
            time: document.getElementById('appTime'),
            leftDate: document.getElementById('leftDateDisplay'),
            timeBox: document.getElementById('timeBox')
        };

        // Hidden Inputs
        this.inputs = {
            selectedTime: document.getElementById('selectedTime'),
            appDate: document.getElementById('appDate')
        };

        this.init();
    }

    init() {
        this.renderTimeSlots();
        this.setupMinDate();
        this.addEventListeners();
    }

    setupMinDate() {
        const today = new Date().toISOString().split('T')[0];
        if (this.inputs.appDate) this.inputs.appDate.min = today;
        if (this.dateSelector) this.dateSelector.min = today;
    }

    addEventListeners() {
        // Service Change
        this.serviceSelect.addEventListener('change', (e) => this.updateServiceDetails(e.target.value));

        // Date Change
        this.dateSelector.addEventListener('change', (e) => this.handleDateChange(e.target.value));

        // Contact Input (Real-time clear)
        this.contactInput.addEventListener('input', () => this.clearError(this.contactInput, 'contactError'));

        // Submit
        this.bookBtn.addEventListener('click', (e) => this.handleSubmit(e));

        // Modal Close (Reset Form)
        const modalEl = document.getElementById('successModal');
        if (modalEl) {
            modalEl.addEventListener('hidden.bs.modal', () => this.resetForm());
        }
    }

    /* --- Logic & Data --- */

    generateTimeSlots() {
        const slots = [];
        // Hours: 10 AM to 5 PM
        for (let hour = 10; hour <= 17; hour++) {
            // Minutes: :00 and :30
            for (let minute = 0; minute < 60; minute += 30) {
                // Skip Lunch (12:00-1:00)
                if (hour === 12) continue;
                // Skip Afternoon Break (3:00-3:30)
                if (hour === 15 && minute === 0) continue;
                // Stop at 5:00 PM exactly
                if (hour === 17 && minute > 0) break;

                const period = hour >= 12 ? 'PM' : 'AM';
                const displayHour = hour > 12 ? hour - 12 : hour;
                const time = `${displayHour.toString().padStart(2, '0')}:${minute === 0 ? '00' : minute} ${period}`;
                
                slots.push(time);
            }
        }
        return slots;
    }

    // UI Updates 

    renderTimeSlots() {
        const slots = this.generateTimeSlots();
        this.timeSlotContainer.innerHTML = '';

        slots.forEach(time => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn slot-btn';
            btn.textContent = time;
            btn.addEventListener('click', (e) => this.selectTimeSlot(e, time, btn));
            this.timeSlotContainer.appendChild(btn);
        });
    }

    selectTimeSlot(e, time, btn) {
        e.preventDefault();
        
        // Remove active class from others
        this.timeSlotContainer.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('active'));
        
        // Activate clicked
        btn.classList.add('active');

        // Update State
        this.inputs.selectedTime.value = time;
        this.display.time.textContent = time;

        // Clear Error
        this.clearError(this.display.timeBox, 'timeError', true);
    }

    updateServiceDetails(service) {
        const config = SERVICE_CONFIG[service];
        if (config) {
            this.display.duration.textContent = config.duration;
            this.display.price.textContent = config.price;
            this.clearError(this.serviceSelect, 'serviceError');
        } else {
            this.display.duration.textContent = '-';
            this.display.price.textContent = '-';
        }
    }

    handleDateChange(dateValue) {
        this.inputs.appDate.value = dateValue;
        
        if (!dateValue) {
            this.display.leftDate.textContent = 'No date selected';
            return;
        }

        const date = new Date(dateValue);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        this.display.leftDate.textContent = date.toLocaleDateString('en-US', options);
        
        this.clearError(this.dateSelector, 'dateError');
    }

    validateContactNumber(phone) {
        // Accept: 09xxxxxxxxx or +639xxxxxxxxx
        const phoneRegex = /^(09\d{9}|(\+63|0)9\d{9})$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    validateForm() {
        let isValid = true;

        // 1. Service
        if (!this.serviceSelect.value) {
            this.showError(this.serviceSelect, 'serviceError', 'Please select a service');
            isValid = false;
        }

        // 2. Date
        const selectedDate = this.inputs.appDate.value;
        if (!selectedDate) {
            this.showError(this.dateSelector, 'dateError', 'Please select a date');
            isValid = false;
        } else {
            const dateObj = new Date(selectedDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (dateObj < today) {
                this.showError(this.dateSelector, 'dateError', 'Please select a future date');
                isValid = false;
            }
        }

        // 3. Time
        if (!this.inputs.selectedTime.value) {
            this.showError(this.display.timeBox, 'timeError', 'Please select a time slot', true);
            isValid = false;
        }

        // 4. Contact
        const contact = this.contactInput.value.trim();
        if (!contact) {
            this.showError(this.contactInput, 'contactError', 'Contact number is required');
            isValid = false;
        } else if (!this.validateContactNumber(contact)) {
            this.showError(this.contactInput, 'contactError', 'Invalid PH number (e.g. 09xxxxxxxxx)');
            isValid = false;
        }

        return isValid;
    }

    // Error Helpers

    showError(element, errorId, message, isCustomBox = false) {
        const errorEl = document.getElementById(errorId);
        
        if (isCustomBox) {
            element.classList.add('error');
        } else {
            element.classList.add('is-invalid');
        }

        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
    }

    clearError(element, errorId, isCustomBox = false) {
        const errorEl = document.getElementById(errorId);
        
        if (isCustomBox) {
            element.classList.remove('error');
        } else {
            element.classList.remove('is-invalid');
        }

        if (errorEl) {
            errorEl.textContent = '';
            errorEl.style.display = 'none';
        }
    }

    // Submission 

    handleSubmit(e) {
        e.preventDefault();

        if (this.validateForm()) {
            if (this.successModal) {
                this.successModal.show();
            } else {
                alert('Appointment Booked Successfully!'); // Fallback
            }
        }
    }

    resetForm() {
        this.dateSelector.value = '';
        this.inputs.appDate.value = '';
        this.form.reset();
        this.inputs.selectedTime.value = '';
        
        this.display.time.textContent = 'Select from available slots';
        this.display.duration.textContent = '-';
        this.display.price.textContent = '-';
        this.display.leftDate.textContent = 'No date selected';
        
        // Clear UI states
        this.timeSlotContainer.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
        this.display.timeBox.classList.remove('error');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new AppointmentBooking();
});