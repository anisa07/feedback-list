import {SyntheticEvent} from "react";
import {Box, Select, Text} from "@chakra-ui/react";

interface SortFeedbackProps {
    sortItems: string[],
    onSort: (sortItem: string) => void
}

export const SortFeedback = (props: SortFeedbackProps) => {
    const handleSelect = (e: SyntheticEvent) => {
        console.log(e)
        // props.onSort(e.target.value);
    }

    return (
        <Box>
            <Text fontSize="12px" px="1rem">Sort by : </Text>
            <Select fontSize="14px" outline="none" fontWeight="semibold" border="none" onSelect={handleSelect}>
                {props.sortItems.map(item => (
                    <option key={item}>
                        {item}
                    </option>
                ))}
            </Select>
        </Box>
    )
}
