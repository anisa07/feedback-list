import {Box, Input, Text, Select} from "@chakra-ui/react";
import {ChangeEvent} from "react";
import {colors} from "../../styles/colors";
import {FormFieldProps} from "./TextField";
import {CategoryOptions} from "../../pages/feedback/create";

export interface SelectFieldProps extends FormFieldProps {
    options: CategoryOptions[]
}

export function SelectField(props: SelectFieldProps) {
    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        props.onChange(event as unknown as ChangeEvent<HTMLInputElement>);
    }

    const textColor = () => props.errorMessage ? 'crimson' : colors.darkblue;

    return (
        <Box my="0.75rem">
            <Text fontWeight="semibold" mb='8px' color={textColor()}>{props.label}</Text>
            <Select
                name={props.name}
                size='md'
                color={textColor()}
                value={props.value}
                isInvalid={!!props.errorMessage}
                errorBorderColor='crimson'
                onChange={handleChange}
            >
                {props.options.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </Select>
            <Text mt='8px' color="crimson">{props.errorMessage}</Text>
        </Box>
    )
}
