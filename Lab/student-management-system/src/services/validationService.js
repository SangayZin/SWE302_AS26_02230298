// src/services/validationService.js

class ValidationService {
    /**
     * Validate Student ID (R1, R2)
     * R1: Student ID is mandatory
     * R2: Student ID must contain exactly 8 digits, numbers only
     */
    validateStudentId(studentId) {
        if (!studentId || studentId.trim() === '') {
            return {
                valid: false,
                message: 'Student ID is mandatory (R1)'
            };
        }

        const studentIdPattern = /^[0-9]{8}$/;
        if (!studentIdPattern.test(studentId)) {
            return {
                valid: false,
                message: 'Student ID must contain exactly 8 digits, numbers only (R2)'
            };
        }

        return {
            valid: true,
            message: 'Student ID is valid'
        };
    }

    /**
     * Validate Password (R3, R4)
     * R3: Password is mandatory
     * R4: Password must contain between 8 and 12 characters, and must include 
     *     at least one uppercase letter, one lowercase letter, and one number
     */
    validatePassword(password) {
        if (!password || password.trim() === '') {
            return {
                valid: false,
                message: 'Password is mandatory (R3)'
            };
        }

        if (password.length < 8 || password.length > 12) {
            return {
                valid: false,
                message: 'Password must contain between 8 and 12 characters (R4)'
            };
        }

        if (!/[A-Z]/.test(password)) {
            return {
                valid: false,
                message: 'Password must include at least one uppercase letter (R4)'
            };
        }

        if (!/[a-z]/.test(password)) {
            return {
                valid: false,
                message: 'Password must include at least one lowercase letter (R4)'
            };
        }

        if (!/[0-9]/.test(password)) {
            return {
                valid: false,
                message: 'Password must include at least one number (R4)'
            };
        }

        return {
            valid: true,
            message: 'Password is valid'
        };
    }

    /**
     * Validate Payment Screenshot (R10)
     * R10: Payment screenshot must be in JPG, JPEG, or PNG format
     */
    validatePaymentScreenshot(file) {
        if (!file) {
            return {
                valid: false,
                message: 'Payment screenshot is mandatory (R10)'
            };
        }

        const allowedExtensions = ['jpg', 'jpeg', 'png'];
        const fileExtension = file.split('.').pop().toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
            return {
                valid: false,
                message: 'Payment screenshot must be in JPG, JPEG, or PNG format (R10)'
            };
        }

        return {
            valid: true,
            message: 'Payment screenshot is valid'
        };
    }

    /**
     * Validate Transaction Number (R11)
     * R11: Transaction number must follow format: 3 digits - hyphen - 9 digits
     */
    validateTransactionNumber(transactionNumber) {
        if (!transactionNumber || transactionNumber.trim() === '') {
            return {
                valid: false,
                message: 'Transaction number is mandatory (R11)'
            };
        }

        const transactionPattern = /^[0-9]{3}-[0-9]{9}$/;
        if (!transactionPattern.test(transactionNumber)) {
            return {
                valid: false,
                message: 'Transaction number must follow format: 3 digits - hyphen - 9 digits (R11)'
            };
        }

        return {
            valid: true,
            message: 'Transaction number is valid'
        };
    }

    /**
     * Validate Registration Conditions (R5, R6, R7, R8)
     * R5: Tuition fees fully paid
     * R6: Valid drug testing report submitted and verified
     * R7: Registration period is open
     * R8: Student cannot register same module more than once
     */
    validateRegistrationConditions(paymentVerified, drugTestVerified, registrationOpen, registeredModules = [], moduleToRegister) {
        const errors = [];

        // R5: Check tuition payment
        if (!paymentVerified) {
            errors.push('Tuition payment not verified.');
        }

        // R6: Check drug test verification (only if payment is OK)
        if (paymentVerified && !drugTestVerified) {
            errors.push('Drug testing report not verified.');
        }

        // R7: Check registration period (only if payment and drug test are OK)
        if (paymentVerified && drugTestVerified && !registrationOpen) {
            errors.push('Registration period is closed.');
        }

        // R8: Check duplicate module registration
        if (paymentVerified && drugTestVerified && registrationOpen) {
            if (registeredModules && registeredModules.includes(moduleToRegister)) {
                errors.push('Cannot register the same module more than once.');
            }
        }

        if (errors.length > 0) {
            return {
                allowed: false,
                message: errors.join(' ')
            };
        }

        return {
            allowed: true,
            message: 'Registration allowed'
        };
    }

    /**
     * Validate Result Viewing Conditions (R14)
     * R14: Only registered students may view their semester results
     */
    validateResultViewing(isRegisteredStudent) {
        if (!isRegisteredStudent) {
            return {
                valid: false,
                message: 'Only registered students may view their semester results (R14)'
            };
        }

        return {
            valid: true,
            message: 'Access granted to view results'
        };
    }
}

module.exports = new ValidationService();