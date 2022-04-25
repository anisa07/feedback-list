import {FeedbackType} from "../../types/FeedbackType";
import {Vote} from "./vote/Vote";
import {Box, Flex, Heading, Text} from "@chakra-ui/react";
import {colors} from "../../styles/colors";

interface FeedbackProps {
    feedback: FeedbackType
}

export const Feedback = (props: FeedbackProps) => {
    return <Flex backgroundColor="white" borderRadius="5px" mb="1rem" p="1rem">
        <Flex alignItems="center" justifyContent="center" flex="1">
            <Vote voteData={props.feedback.vote}/>
        </Flex>
        <Box flex="2">
            <Heading as="h4" size="sm" fontWeight="semibold">
                {props.feedback.title}
            </Heading>
            <Text color={colors.darkgray} my="0.5rem">
                {props.feedback.detail}
            </Text>
            <Text display="inline-block" backgroundColor={colors.lightbluegray} color="blue.600" borderRadius='25px' p="0.25rem 0.7rem" fontWeight="semibold">
                {props.feedback.type.type}
            </Text>
        </Box>
        <Box flex="1" fontWeight="semibold" color={colors.darkgray} alignSelf="center" justifyContent="center">
            {props.feedback.comments.length}
        </Box>
    </Flex>
}
