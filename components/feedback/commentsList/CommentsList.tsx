import { Box, Heading, Text } from "@chakra-ui/react"
import {CommentType} from "../../../types/FeedbackType";
import {Comment} from "../comment/Comment";

interface CommentsListProps {
    comments: CommentType[],
    onReply: (a: string) => void
}

export const CommentsList = (props: CommentsListProps) => {

    return <Box my="1rem" backgroundColor="white" p="2rem" borderRadius="5px">
        <Heading as="h4" size="md" fontWeight="semibold">
            {`${props.comments?.length} Comment(s)`}
        </Heading>
        {props.comments?.map(comment => (
            <Comment onReply={props.onReply} key={comment.id} comment={comment} />
        ))}
    </Box>
}
