import {GetServerSideProps, NextPage} from "next";
import {getFeedback, saveComment, saveFeedback} from "../../services/feedbackService";
import {CommentType, FeedbackType} from "../../types/FeedbackType";
import {Box, Button, Flex} from "@chakra-ui/react";
import {colors} from "../../styles/colors";
import {GoBackLink} from "../../components/goBackLink/GoBackLink";
import {Feedback} from "../../components/feedback/Feedback";
import {CommentsList} from "../../components/feedback/commentsList/CommentsList";
import {AddComment} from "../../components/feedback/addComment/AddComment";
import {useRef, useState} from "react";
import {useRouter} from "next/router";

export interface FeedbackProps {
    feedback: FeedbackType
}

const FeedbackInDetails: NextPage<FeedbackProps> = (props: FeedbackProps) => {
    const [commentTo, setCommentTo] = useState("");
    const router = useRouter();

    const commentRef = useRef<HTMLTextAreaElement>(null);

    const handleEditFeedback = () => {
        router.push(`/feedback/edit/${props.feedback.id}`);
    }

    const handleReplyComment = (a: string) => {
        if (commentRef && commentRef.current) {
            commentRef.current.focus();
        }
        setCommentTo(a);
    }

    const handleSubmitComment = async (newComment: CommentType) => {
        // TODO fix authorID
        const commentId = await saveComment({
            authorId: "9dd1a809-5bce-401e-accb-07b7f6808c11",
            text: newComment.comment,
            id: "",
            feedbackId: props.feedback.id
        });
        await saveFeedback({...props.feedback, comments: [...props.feedback.comments, {id: commentId } as CommentType]});
        // TODO fix
        router.back()
    }

    return <Box p={{base: '1rem', md: '3rem', lg: '5rem 7.5rem'}}>
        <Flex justifyContent="space-between" alignItems="center" mb="1rem">
            <GoBackLink color={colors.darkblue} />
            <Button color="white" backgroundColor="blue.500" size='md'
                    fontWeight="semibold" onClick={handleEditFeedback} >
                Edit Feedback
            </Button>
        </Flex>
        <Feedback feedback={props.feedback} />
        <CommentsList onReply={handleReplyComment} comments={props.feedback.comments} />
        <AddComment sendTo={commentTo} onSubmitComment={handleSubmitComment} commentRef={commentRef} />
    </Box>
}

export const getServerSideProps: GetServerSideProps<FeedbackProps> = async (context) => {
    const feedback = await getFeedback(context.params?.id as string);
    return {
        props: {
            feedback
        }
    }
}


export default FeedbackInDetails
