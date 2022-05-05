import CreatableSelect from 'react-select/creatable';
import {InputActionMeta, SingleValue} from 'react-select';
import {Box, Text} from '@chakra-ui/react';
import {colors} from "../../styles/colors";
import {Options} from "../feedbackForm/FeedbackForm";
import {useEffect, useState} from "react";

export interface CreatableSelectProps {
    defaultValue: string,
    label: string,
    errorMessage: string,
    options: Options[],
    onChangeCreateField: (newValue: string, actionMeta?: InputActionMeta) => void,
}

export const CreatableField = (props: CreatableSelectProps) => {
    const textColor = () => props.errorMessage ? 'crimson' : colors.darkblue;
    const [defaultValue, setDefaultValue] = useState<Options>();

    useEffect(() => {
        if (props.options && props.defaultValue) {
            setDefaultValue(props.options.find(item => item.value === props.defaultValue));
        }
    }, [props.defaultValue, props.options])

    const handleChange = (e: SingleValue<Options>) => {
        props.onChangeCreateField(e?.value || "");
    }

    const handleInputChange = (newValue: string, actionMeta: InputActionMeta) => {
        props.onChangeCreateField(newValue, actionMeta);
    };

    console.log(defaultValue)
    return <Box>
        <Text fontWeight="semibold" mb='8px' color={textColor()}>{props.label}</Text>
        <CreatableSelect
            defaultValue={defaultValue}
            isClearable={true}
            options={props.options}
            onInputChange={handleInputChange}
            onChange={handleChange}
        />
        <Text mt='8px' color="crimson">{props.errorMessage}</Text>
    </Box>
}
