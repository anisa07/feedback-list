import {VoteType} from "../../../types/FeedbackType";
import {Box, Flex, Text} from "@chakra-ui/react";
import {colors} from "../../../styles/colors";

export enum Direction {
    COLUMN = "column",
    ROW = "row"
}

interface VoteProps {
    voteData: VoteType,
    direction: Direction
}

export const Vote = (props: VoteProps) => {
    const voteValue = () => {
        return props.voteData.voteUp.length - props.voteData.voteDown.length;
    }
    return (
        <Box backgroundColor={colors.lightbluegray} color="blue.600" display="inline-block" borderRadius="5px" p="0.25rem 0.7rem">
            <Flex flexDirection={props.direction} alignItems="center">
                <button>&#9653;</button>
                <Text mx="0.5rem">
                    {voteValue()}
                </Text>
                <button>&#9661;</button>
            </Flex>
        </Box>
    )
}
