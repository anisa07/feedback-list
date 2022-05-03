import { Box } from "@chakra-ui/react"
import {CommentType} from "../../../types/FeedbackType";
import {Comment} from "../comment/Comment";

interface CommentsListProps {
    comments: CommentType[]
}

export const CommentsList = (props: CommentsListProps) => {
    return <Box my="1rem" backgroundColor="white">
        {props.comments.map(comment => (
            <Comment key={comment.id} comment={comment} />
        ))}
    </Box>
}
