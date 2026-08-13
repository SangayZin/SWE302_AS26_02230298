// tests/unit/validationService.test.js
const validationService = require('../../src/services/validationService');

describe('Validation Service - Student ID (R1, R2)', () => {
    test('TC1 - Valid Student ID (R1, R2)', () => {
        const result = validationService.validateStudentId('02230298');
        expect(result.valid).toBe(true);
        expect(result.message).toBe('Student ID is valid');
    });

    test('TC2 - Student ID with letters (R1, R2)', () => {
        const result = validationService.validateStudentId('0223A123');
        expect(result.valid).toBe(false);
        expect(result.message).toContain('exactly 8 digits');
    });

    test('TC3 - Empty Student ID (R1)', () => {
        const result = validationService.validateStudentId('');
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Student ID is mandatory (R1)');
    });

    test('TC4 - Student ID with 7 digits (R2)', () => {
        const result = validationService.validateStudentId('2230298');
        expect(result.valid).toBe(false);
        expect(result.message).toContain('exactly 8 digits');
    });

    test('TC5 - Student ID with 9 digits (R2)', () => {
        const result = validationService.validateStudentId('022301234');
        expect(result.valid).toBe(false);
        expect(result.message).toContain('exactly 8 digits');
    });
});

describe('Validation Service - Password (R3, R4)', () => {
    test('TC6 - Valid Password (R3, R4)', () => {
        const result = validationService.validatePassword('Sangay22');
        expect(result.valid).toBe(true);
        expect(result.message).toBe('Password is valid');
    });

    test('TC7 - Password all lowercase (R4)', () => {
        const result = validationService.validatePassword('sangay22');
        expect(result.valid).toBe(false);
        expect(result.message).toContain('at least one uppercase letter');
    });

    test('TC8 - Empty Password (R3)', () => {
        const result = validationService.validatePassword('');
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Password is mandatory (R3)');
    });

    test('TC9 - Password too short - 7 characters (R4)', () => {
        const result = validationService.validatePassword('Sangay1');
        expect(result.valid).toBe(false);
        expect(result.message).toContain('between 8 and 12 characters');
    });

    test('TC10 - Password too long - 13 characters (R4)', () => {
        const result = validationService.validatePassword('SangayTenzin23');
        expect(result.valid).toBe(false);
        expect(result.message).toContain('between 8 and 12 characters');
    });

    test('Password all uppercase', () => {
        const result = validationService.validatePassword('SANGAY22');
        expect(result.valid).toBe(false);
        expect(result.message).toContain('at least one lowercase letter');
    });

    test('Password with no digits', () => {
        const result = validationService.validatePassword('SangayTen');
        expect(result.valid).toBe(false);
        expect(result.message).toContain('at least one number');
    });
});

describe('Validation Service - Payment Screenshot (R10)', () => {
    test('TC11 - Valid JPG screenshot (R10)', () => {
        const result = validationService.validatePaymentScreenshot('receipt.jpg');
        expect(result.valid).toBe(true);
        expect(result.message).toBe('Payment screenshot is valid');
    });

    test('TC12 - Invalid PDF screenshot (R10)', () => {
        const result = validationService.validatePaymentScreenshot('receipt.pdf');
        expect(result.valid).toBe(false);
        expect(result.message).toContain('JPG, JPEG, or PNG format');
    });

    test('TC13 - No file uploaded (R10)', () => {
        const result = validationService.validatePaymentScreenshot(null);
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Payment screenshot is mandatory (R10)');
    });

    test('Valid JPEG screenshot', () => {
        const result = validationService.validatePaymentScreenshot('payment.jpeg');
        expect(result.valid).toBe(true);
    });

    test('Valid PNG screenshot', () => {
        const result = validationService.validatePaymentScreenshot('screenshot.png');
        expect(result.valid).toBe(true);
    });
});

describe('Validation Service - Transaction Number (R11)', () => {
    test('TC14 - Valid Transaction Number (R11)', () => {
        const result = validationService.validateTransactionNumber('123-456789012');
        expect(result.valid).toBe(true);
        expect(result.message).toBe('Transaction number is valid');
    });

    test('TC15 - Wrong format transaction number (R11)', () => {
        const result = validationService.validateTransactionNumber('12-3456789012');
        expect(result.valid).toBe(false);
        expect(result.message).toContain('3 digits - hyphen - 9 digits');
    });

    test('TC16 - Empty transaction number (R11)', () => {
        const result = validationService.validateTransactionNumber('');
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Transaction number is mandatory (R11)');
    });
});

describe('Validation Service - Registration Conditions (R5, R6, R7, R8)', () => {
    test('TC17 - All conditions met, registration allowed', () => {
        const result = validationService.validateRegistrationConditions(
            true, true, true, [], 'SWE301'
        );
        expect(result.allowed).toBe(true);
        expect(result.message).toBe('Registration allowed');
    });

    test('TC18 - Payment not verified (R5)', () => {
        const result = validationService.validateRegistrationConditions(
            false, true, true, [], 'SWE301'
        );
        expect(result.allowed).toBe(false);
        expect(result.message).toContain('Tuition payment not verified.');
    });

    test('TC19 - Drug test not verified (R6)', () => {
        const result = validationService.validateRegistrationConditions(
            true, false, true, [], 'SWE301'
        );
        expect(result.allowed).toBe(false);
        expect(result.message).toContain('Drug testing report not verified.');
    });

    test('TC20 - Registration period closed (R7)', () => {
        const result = validationService.validateRegistrationConditions(
            true, true, false, [], 'SWE301'
        );
        expect(result.allowed).toBe(false);
        expect(result.message).toContain('Registration period is closed.');
    });

    test('TC21 - Duplicate module registration prevented (R8)', () => {
        const result = validationService.validateRegistrationConditions(
            true, true, true, ['SWE301', 'SWE302'], 'SWE301'
        );
        expect(result.allowed).toBe(false);
        expect(result.message).toContain('Cannot register the same module more than once.');
    });
});

describe('Validation Service - Result Viewing (R14)', () => {
    test('TC22 - Unregistered student access denied (R14)', () => {
        const result = validationService.validateResultViewing(false);
        expect(result.valid).toBe(false);
        expect(result.message).toContain('Only registered students may view their semester results');
    });

    test('TC23 - Registered student access granted (R14)', () => {
        const result = validationService.validateResultViewing(true);
        expect(result.valid).toBe(true);
        expect(result.message).toBe('Access granted to view results');
    });
});

// Decision Table Tests (8 combinations from Lab 1)
describe('Decision Table - Registration Rules (R5, R6, R7)', () => {
    test('Rule 1: NNN - Payment not verified', () => {
        const result = validationService.validateRegistrationConditions(
            false, false, false, [], 'SWE301'
        );
        expect(result.allowed).toBe(false);
        expect(result.message).toContain('Tuition payment not verified.');
    });

    test('Rule 2: NNY - Payment not verified', () => {
        const result = validationService.validateRegistrationConditions(
            false, false, true, [], 'SWE301'
        );
        expect(result.allowed).toBe(false);
        expect(result.message).toContain('Tuition payment not verified.');
    });

    test('Rule 3: NYN - Payment not verified', () => {
        const result = validationService.validateRegistrationConditions(
            false, true, false, [], 'SWE301'
        );
        expect(result.allowed).toBe(false);
        expect(result.message).toContain('Tuition payment not verified.');
    });

    test('Rule 4: NYY - Payment not verified', () => {
        const result = validationService.validateRegistrationConditions(
            false, true, true, [], 'SWE301'
        );
        expect(result.allowed).toBe(false);
        expect(result.message).toContain('Tuition payment not verified.');
    });

    test('Rule 5: YNN - Drug test not verified', () => {
        const result = validationService.validateRegistrationConditions(
            true, false, false, [], 'SWE301'
        );
        expect(result.allowed).toBe(false);
        expect(result.message).toContain('Drug testing report not verified.');
    });

    test('Rule 6: YNY - Drug test not verified', () => {
        const result = validationService.validateRegistrationConditions(
            true, false, true, [], 'SWE301'
        );
        expect(result.allowed).toBe(false);
        expect(result.message).toContain('Drug testing report not verified.');
    });

    test('Rule 7: YYN - Registration period closed', () => {
        const result = validationService.validateRegistrationConditions(
            true, true, false, [], 'SWE301'
        );
        expect(result.allowed).toBe(false);
        expect(result.message).toContain('Registration period is closed.');
    });

    test('Rule 8: YYY - Registration allowed', () => {
        const result = validationService.validateRegistrationConditions(
            true, true, true, [], 'SWE301'
        );
        expect(result.allowed).toBe(true);
        expect(result.message).toBe('Registration allowed');
    });
});