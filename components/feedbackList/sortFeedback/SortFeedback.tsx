import {ChangeEvent, SyntheticEvent} from "react";
import {Box, Select, Text} from "@chakra-ui/react";
import {SortType} from "../../../types/SortType";

interface SortFeedbackProps {
    sortItems: string[],
    onSort: (sortItem: SortType) => void
}

export const SortFeedback = (props: SortFeedbackProps) => {
    const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        props.onSort(e.target.value as SortType);
    }

    return (
        <Box>
            <Text fontSize="12px" px="1rem">Sort by : </Text>
            <Select placeholder='Sort feedbacks' fontSize="14px" outline="none" fontWeight="semibold" border="none" onChange={handleSelect}>
                {props.sortItems.map(item => (
                    <option key={item}>
                        {item}
                    </option>
                ))}
            </Select>
        </Box>
    )
}
