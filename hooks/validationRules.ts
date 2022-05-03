import {ValidationArgs, ValidationResult} from "../types/ValidationTypes";
import {EMAIL_W3C} from "../helpers/regexRules";

function returnValidationResult(errorCondition: boolean, errorMessage: string): ValidationResult {
    if (errorCondition) {
        return {
            error: true,
            errorMessage: errorMessage
        };
    }
    return {
        error: false,
        errorMessage: ''
    };
}

export function ensureNotEmpty(value: ValidationArgs): ValidationResult {
    return returnValidationResult((value as string).length === 0, 'Required');
}

export function ensureEmail(value: ValidationArgs): ValidationResult {
    const isEmailFormat = (value as string).toLowerCase().match(EMAIL_W3C);
    return returnValidationResult(!isEmailFormat, 'Email is invalid');
}
