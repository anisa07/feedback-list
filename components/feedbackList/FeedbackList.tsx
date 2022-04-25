import {FeedbackType} from "../../types/FeedbackType";
import {Feedback} from "../feedback/Feedback";
import {Box} from "@chakra-ui/react";

interface FeedbackListProps {
    feedbackList: FeedbackType[];
}

export const FeedbackList = (props: FeedbackListProps) => {
    return <Box p={{
        base: "1.3rem",
        md: 0
    }} pt="0">
        {props.feedbackList.map(item =>
            <Feedback key={item.id} feedback={item} />
        )}
    </Box>
}
