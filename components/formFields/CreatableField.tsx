import CreatableSelect from 'react-select/creatable';
import {InputActionMeta, SingleValue} from 'react-select';
import {Box, Text} from '@chakra-ui/react';
import {colors} from "../../styles/colors";
import {Options} from "../feedbackForm/FeedbackForm";

export interface CreatableSelectProps {
    label: string,
    errorMessage: string,
    options: Options[],
    onChangeCreateField: (newValue: string, actionMeta?: InputActionMeta) => void,
}

export const CreatableField = (props: CreatableSelectProps) => {
    const textColor = () => props.errorMessage ? 'crimson' : colors.darkblue;

    const handleChange = (e: SingleValue<Options>) => {
        props.onChangeCreateField(e?.value || "");
    }

    const handleInputChange = (newValue: string, actionMeta: InputActionMeta) => {
        props.onChangeCreateField(newValue, actionMeta);
    };

    return <Box>
        <Text fontWeight="semibold" mb='8px' color={textColor()}>{props.label}</Text>
        <CreatableSelect
            isClearable={true}
            options={props.options}
            onInputChange={handleInputChange}
            onChange={handleChange}
        />
        <Text mt='8px' color="crimson">{props.errorMessage}</Text>
    </Box>
}
