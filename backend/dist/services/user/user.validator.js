"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserBase = validateUserBase;
exports.validateUser = validateUser;
exports.validateUpdateUser = validateUpdateUser;
const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
const emailValidation = {
    testIfString: (email) => typeof email === 'string',
    testIfValid: (email) => email.includes('@'),
};
const passwordValidation = {
    testIfString: (password) => typeof password === 'string',
    testIfValid: (password) => regex.test(password),
    testIfLength: (password) => password.length >= 8 && password.length <= 20,
    testIfEmptyConfirmPassword: (confirmPassword) => confirmPassword.trim() === '',
    testIfMatch: (password, confirmPassword) => password === confirmPassword,
};
function validateUserBase(data) {
    if (typeof data !== 'object' || data === null) {
        return {
            success: false,
            errors: {
                email: ['Invalid payload'],
                password: ['Invalid payload'],
            },
        };
    }
    const errors = {
        email: [],
        password: [],
    };
    const email = data.email;
    const password = data.password;
    emailValidation.testIfString(email) ||
        errors.email.push('You must send an email address');
    passwordValidation.testIfString(password) ||
        errors.password.push('You must send a password');
    if (errors.email.length || errors.password.length) {
        return { success: false, errors };
    }
    return {
        success: true,
        data: { email, password },
    };
}
function validateUser(data) {
    // Reutiliza as validações básicas de email e password
    const result = validateUserBase(data);
    if (!result.success) {
        return result;
    }
    // Validações adicionais para o password
    const errors = [];
    const email = result.data.email;
    const password = result.data.password;
    passwordValidation.testIfLength(password) ||
        errors.push('Password must be between 8 and 20 characters');
    passwordValidation.testIfValid(password) ||
        errors.push('Password must contain uppercase, lowercase, number and special character');
    if (errors.length) {
        return { success: false, errors: { email: [], password: errors } };
    }
    return {
        success: true,
        data: { email, password },
    };
}
function validateUpdateUser(data) {
    const errors = {
        email: [],
        password: [],
    };
    if (typeof data !== 'object' || data === null) {
        return {
            success: false,
            errors: {
                email: ['Invalid payload'],
                password: ['Invalid payload'],
            },
        };
    }
    const { email, password } = data;
    if (email !== undefined) {
        const isValidEmail = emailValidation.testIfString(email) && emailValidation.testIfValid(email);
        if (!isValidEmail)
            errors.email.push('Invalid email');
    }
    if (password !== undefined) {
        const isStringPassword = passwordValidation.testIfString(password);
        if (!isStringPassword) {
            errors.password.push('Invalid password');
        }
        else {
            const isLengthValid = passwordValidation.testIfLength(password);
            const hasValidChars = passwordValidation.testIfValid(password);
            if (!isLengthValid) {
                errors.password.push('Password must be between 8 and 20 characters');
            }
            if (!hasValidChars) {
                errors.password.push('Password must contain uppercase, lowercase, number and special character');
            }
        }
    }
    if (errors.email.length || errors.password.length) {
        return { success: false, errors };
    }
    return {
        success: true,
        data: {
            email,
            password,
        },
    };
}
//# sourceMappingURL=user.validator.js.map