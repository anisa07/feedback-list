import {GetServerSideProps, NextPage} from "next";
import {getFeedback} from "../../services/feedbackService";
import {FeedbackType} from "../../types/FeedbackType";
import {Box, Button, Flex} from "@chakra-ui/react";
import {colors} from "../../styles/colors";
import {GoBackLink} from "../../components/goBackLink/GoBackLink";
import {Feedback} from "../../components/feedback/Feedback";
import {CommentsList} from "../../components/feedback/commentsList/CommentsList";
import {AddComment} from "../../components/feedback/addComment/AddComment";
import {useRef, useState} from "react";

interface FeedbackProps {
    feedback: FeedbackType
}

const FeedbackInDetails: NextPage<FeedbackProps> = (props: FeedbackProps) => {
    // console.log(props.feedback)
    const [commentTo, setCommentTo] = useState("");

    const commentRef = useRef<HTMLTextAreaElement>(null);

    const handleEditFeedback = () => {}

    const handleReplyComment = (a: string) => {
        if (commentRef && commentRef.current) {
            commentRef.current.focus();
        }
        setCommentTo(a);
    }

    const handleSubmitComment = () => {}

    return <Box p={{base: '1rem', md: '3rem', lg: '5rem 7.5rem'}}>
        <Flex justifyContent="space-between" alignItems="center" mb="1rem">
            <GoBackLink color={colors.darkblue} />
            <Button color="white" backgroundColor="blue.500" size='md'
                    fontWeight="semibold" onClick={handleEditFeedback}>
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
