import {Box, Text, Textarea} from "@chakra-ui/react";
import {ChangeEvent} from "react";
import {colors} from "../../styles/colors";
import {FormFieldProps} from "./TextField";

export function TextAreaField(props: FormFieldProps) {
    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        props.onChange(event as unknown as ChangeEvent<HTMLInputElement>);
    }

    const textColor = () => props.errorMessage ? 'crimson' : colors.darkblue;

    return (
        <Box my="0.75rem">
            <Text fontWeight="semibold" mb='8px' color={textColor()}>{props.label}</Text>
            <Textarea
                name={props.name}
                rows={7}
                isInvalid={!!props.errorMessage}
                size='md'
                value={props.value}
                color={textColor()}
                errorBorderColor='crimson'
                resize="none"
                onChange={handleChange}
            />
            <Text mt='8px' color="crimson">{props.errorMessage}</Text>
        </Box>
    )
}
