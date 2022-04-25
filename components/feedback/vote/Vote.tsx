import {VoteType} from "../../../types/FeedbackType";
import {Box, Flex} from "@chakra-ui/react";
import {colors} from "../../../styles/colors";

interface VoteProps {
    voteData: VoteType,
}

export const Vote = (props: VoteProps) => {
    const voteValue = () => {
        return props.voteData.voteUp.length - props.voteData.voteDown.length;
    }
    return (
        <Box backgroundColor={colors.lightbluegray} color="blue.600" display="inline-block" borderRadius="5px" p="0.25rem 0.7rem">
            <Flex flexDirection="column" alignItems="center">
                <button>&#9653;</button>
                {voteValue()}
                <button>&#9661;</button>
            </Flex>
        </Box>
    )
}
