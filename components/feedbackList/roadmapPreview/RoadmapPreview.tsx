import {Box, Flex, Link, Text} from "@chakra-ui/react";
import {colors} from "../../../styles/colors";
import {RoadmapType, StatusEnum, StatusType} from "../../../types/FeedbackType";

export interface RoadmapPreviewProps {
    roadmap: RoadmapType[]
}

export const RoadmapPreview = (props: RoadmapPreviewProps) => {
    const selectColorClass = (item: StatusType) => {
        switch (item.status) {
            case StatusEnum.PLANNED:
                return colors.salmon;
            case StatusEnum.IN_PROGRESS:
                return colors.fuchsia;
            case StatusEnum.LIVE:
                return colors.lightblue;
        }
    }

    return (
        <Box
            display={{
                base: "none",
                md: "inline-block"
            }}
            p="1rem"
            mb={{
                md: '1.5rem',
            }}
            backgroundColor='white'
            borderRadius="5px"
            flex={{
                base: 1,
                lg: "unset"
            }}
        >
            <Flex justifyContent="space-between" alignItems="center">
                <Text fontWeight="semibold">Roadmap</Text>
                <Link textDecoration='underline' fontSize="12px" color="blue.600" href="/roadmap">View</Link>
            </Flex>
        {props.roadmap.map(item => (
            <Flex key={item.status} justifyContent="space-between" alignItems="center" color="gray.600">
                <Flex alignItems="center">
                    <Text mr='0.5rem' fontSize="20px" color={selectColorClass(item)}>&#8226;</Text>
                    <Text textTransform="capitalize">{item.status}</Text>
                </Flex>
                <Box fontWeight="semibold">
                    {item.quantity}
                </Box>
            </Flex>
            ))}
        </Box>
    );
}
