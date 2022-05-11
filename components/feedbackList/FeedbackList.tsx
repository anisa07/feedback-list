import {FeedbackType} from "../../types/FeedbackType";
import {Feedback} from "../feedback/Feedback";
import {Box} from "@chakra-ui/react";
import {VoteState} from "../feedback/vote/Vote";

interface FeedbackListProps {
    feedbackList: FeedbackType[];
    onVote: (v: VoteState, feedback: FeedbackType) => void;
}

export const FeedbackList = (props: FeedbackListProps) => {
    return <Box p={{
        base: "1.3rem",
        md: 0
    }} pt="0">
        {props.feedbackList.map(item =>
            <Feedback onVote={props.onVote} key={item.id} feedback={item} />
        )}
    </Box>
}
