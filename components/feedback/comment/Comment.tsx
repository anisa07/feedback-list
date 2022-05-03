import {Box} from "@chakra-ui/react";
import {CommentType} from "../../../types/FeedbackType";

interface CommentProps {
    comment: CommentType
}

export const Comment = (props: CommentProps) => {
    console.log(props.comment)
    return <Box>
        {props.comment.comment}
    </Box>
}
