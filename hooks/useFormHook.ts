import { useCallback, useEffect, useState, ChangeEvent } from 'react';
import {FormDataElement, ValidationResult, FormData} from "../types/ValidationTypes";

export function useFormCustomHook(formData: FormData) {
    const [form, setForm] = useState(formData);
    const [errorsMap, setErrorsMap] = useState(new Map());

    const validateFunc = (inputField: FormDataElement): ValidationResult => {
        for (const validate of inputField.validation) {
            const validationResult = validate(inputField.value, form);
            if (validationResult.error) {
                return validationResult;
            }
        }
        return {
            error: false,
            errorMessage: ''
        };
    };

    const fillErrorsMap = (data: FormData) => {
        const newErrorsMap = new Map();
        Object.entries(data).forEach(([fieldName, field]) => {
            const validationResult = validateFunc(field);
            if (validationResult.error) {
                newErrorsMap.set(fieldName, true);
            }
        });
        setErrorsMap(newErrorsMap);
    };

    useEffect(() => {
        fillErrorsMap(formData);
    }, []);

    const validateField = useCallback((inputField: FormDataElement) => validateFunc(inputField), [form]);

    const onChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const { name, value } = event.target;
            const inputObj = { ...form[name] };
            inputObj.value = value;
            const isValidInput = validateField(inputObj);
            inputObj.error = isValidInput.error;
            inputObj.errorMessage = isValidInput.errorMessage;

            const mapHasError = errorsMap.has(name);
            if (mapHasError !== inputObj.error) {
                const newErrorsMap = new Map(errorsMap);
                inputObj.error ? newErrorsMap.set(name, true) : newErrorsMap.delete(name);
                setErrorsMap(newErrorsMap);
            }

            setForm({ ...form, [name]: inputObj });
        },
        [form, validateField, errorsMap]
    );

    const isValid = useCallback(() => {
        return !errorsMap.size;
    }, [errorsMap]);

    const resetFormData = (data: FormData) => {
        setForm(data);
        fillErrorsMap(data);
    };

    return { onChange, isValid, form, resetFormData };
}
