import {FeedbackType} from "../../types/FeedbackType";
import {Direction, Vote} from "./vote/Vote";
import {Box, Flex, Heading, Link, Text} from "@chakra-ui/react";
import {colors} from "../../styles/colors";

interface FeedbackProps {
    feedback: FeedbackType
}

export const Feedback = (props: FeedbackProps) => {
    return <Flex backgroundColor="white" borderRadius="5px" mb="1rem" p="1rem">
        <Flex display={{ base: "none", md: "flex"}} alignItems="center" justifyContent="center" flex="1">
            <Vote direction={Direction.COLUMN} voteData={props.feedback.vote}/>
        </Flex>
        <Box flex="2">
            <Heading as="h4" size="sm" fontWeight="semibold">
                <Link href={`/feedback/${props.feedback.id}`}>{props.feedback.title}</Link>
            </Heading>
            <Text color={colors.darkgray} my="0.5rem">
                {props.feedback.detail}
            </Text>
            <Text display="inline-block" backgroundColor={colors.lightbluegray} color="blue.600" borderRadius='25px' p="0.25rem 0.7rem" fontWeight="semibold">
                {props.feedback.type.type}
            </Text>
            <Flex display={{ base: "flex", md: "none"}}  alignItems="center" justifyContent="space-between" my="0.5rem">
                <Vote direction={Direction.ROW} voteData={props.feedback.vote}/>
                <Text fontWeight="semibold" color={colors.darkgray} alignSelf="center" justifyContent="center">
                    {props.feedback.comments.length}
                </Text>
            </Flex>
        </Box>
        <Text textAlign="center" display={{ base: "none", md: "block"}} flex="1" fontWeight="semibold" color={colors.darkgray} alignSelf="center" justifyContent="center">
            {props.feedback.comments.length}
        </Text>
    </Flex>
}
