import {Box, Input, Text} from "@chakra-ui/react";
import {ChangeEvent} from "react";
import {colors} from "../../styles/colors";

export interface FormFieldProps {
    value: string,
    label: string,
    errorMessage: string,
    onChange: (v: string) => void
}

export function TextField(props: FormFieldProps) {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        props.onChange(event.target.value);
    }

    const textColor = () => props.errorMessage ? 'crimson' : colors.darkblue;

    return (
        <Box my="0.75rem">
            <Text fontWeight="semibold" mb='8px' color={textColor()}>{props.label}</Text>
            <Input
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
