import {FilterType} from "../../../types/FilterType";
import {Box} from "@chakra-ui/react";

interface FilterProps {
    filters: FilterType[],
    onSelect: (f: FilterType) => void
}

export const Filter = (props: FilterProps) => {
    const colorClass = (item: FilterType) => {
        return item.selected ? `white` : `blue.600`
    }
    const bgClass = (item: FilterType) => {
        return item.selected ? `blue.600` : `white`
    }
    return (
        <Box
            display={{
                base: "none",
                md: "flex"
            }}
            p="1rem"
            mr={{
                md: '1.5rem',
                lg: 0
            }}
            mb={{
                md: '1.5rem',
            }}
            backgroundColor='white'
            borderRadius="5px"
            alignItems="start"
            flexWrap="wrap"
            flex={{
                base: 1
            }}
        >
            {props.filters.map(item => (
                <Box key={item.id}
                     p="0.25rem 0.7rem"
                     mr="0.25rem"
                     borderRadius='25px'
                     fontWeight="semibold"
                     color={colorClass(item)}
                     backgroundColor={bgClass(item)}
                >
                    {item.type}
                </Box>
            ))}
        </Box>
    )
}
