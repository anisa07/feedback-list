import {Flex, Heading, Text} from "@chakra-ui/react";
import {FeedbackType, StatusEnum} from "../../../types/FeedbackType";
import {colors} from "../../../styles/colors";
import {Direction, Vote, VoteState} from "../../feedback/vote/Vote";

interface RoadmapCardProps {
    roadmapCard: FeedbackType,
    name: StatusEnum,
    onVote: (v: VoteState, feedback: FeedbackType) => void;
}

export const RoadmapCard = (props: RoadmapCardProps) => {
    const selectColor = () => {
        switch (props.name) {
            case StatusEnum.PLANNED:
                return colors.salmon;
            case StatusEnum.IN_PROGRESS:
                return colors.fuchsia;
            case StatusEnum.LIVE:
                return colors.lightblue;
        }
    }

    const handleVote = (v: VoteState) => {
        props.onVote(v, props.roadmapCard);
    }

    return <Flex
        borderTop={`5px solid ${selectColor()}`}
        p="1rem"
        my="0.5rem"
        direction="column"
        backgroundColor={colors.white}
        height="17rem"
        flex="1"
        borderRadius="5px">
        <Flex alignItems="center">
            <Text mr='0.5rem' fontSize="20px" color={selectColor()}>&#8226;</Text>
            <Text>{props.name}</Text>
        </Flex>
        <Heading as="h4" size="sm" fontWeight="semibold" mt="0.5rem">
            {props.roadmapCard.title}
        </Heading>
        <Text color={colors.darkgray} my="0.5rem" height="10rem" overflowY="hidden">
            {props.roadmapCard.detail}
        </Text>
        <Text
            my="0.5rem"
            alignSelf="flex-start"
            display="inline-block"
            backgroundColor={colors.lightbluegray}
            color="blue.600"
            borderRadius='25px'
            p="0.25rem 0.7rem"
            fontWeight="semibold">
            {props.roadmapCard.type.type}
        </Text>
        <Flex alignItems="center" justifyContent="space-between" my="0.5rem">
            <Vote onVote={handleVote} direction={Direction.ROW} voteData={props.roadmapCard.vote}/>
            <Text fontWeight="semibold" color={colors.darkgray}>
                {props.roadmapCard.comments.length}
            </Text>
        </Flex>
    </Flex>
}
