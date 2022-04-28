export interface ValidationResult {
    error: boolean;
    errorMessage: string;
}

export type ValidationArgs = string | number | boolean | Date;

export interface FormValidationFunction {
    (value: ValidationArgs): ValidationResult;
}

export interface FormDataElement {
    value: string;
    error: boolean;
    errorMessage: string;
    validation: Array<FormValidationFunction>;
}

export interface FormData {
    [key: string]: FormDataElement;
}
