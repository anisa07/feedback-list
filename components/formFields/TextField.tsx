import {Box, Input, Text} from "@chakra-ui/react";
import {ChangeEvent} from "react";
import {colors} from "../../styles/colors";

export interface FormFieldProps {
    name: string,
    value: string,
    label: string,
    errorMessage: string,
    type?: string,

    onChange: (v: ChangeEvent<HTMLInputElement>) => void,
}

export function TextField(props: FormFieldProps) {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        props.onChange(event);
    }

    const textColor = () => props.errorMessage ? 'crimson' : colors.darkblue;

    return (
        <Box my="0.75rem">
            <Text fontWeight="semibold" mb='8px' color={textColor()}>{props.label}</Text>
            <Input
                type={props.type}
                name={props.name}
                isInvalid={!!props.errorMessage}
                size='md'
                value={props.value}
                color={textColor()}
                errorBorderColor='crimson'
                onChange={handleChange}
            />
            <Text mt='8px' color="crimson">{props.errorMessage}</Text>
        </Box>
    )
}
