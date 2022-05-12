import {NextPage} from "next";
import {saveComment, saveFeedback} from "../../services/feedbackService";
import {CommentType, FeedbackType} from "../../types/FeedbackType";
import {Box, Button, Flex} from "@chakra-ui/react";
import {colors} from "../../styles/colors";
import {GoBackLink} from "../../components/goBackLink/GoBackLink";
import {Feedback} from "../../components/feedback/Feedback";
import {CommentsList} from "../../components/feedback/commentsList/CommentsList";
import {AddComment} from "../../components/feedback/addComment/AddComment";
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import {useAppDispatch, useAppSelector} from "../../hooks/reduxHooks";
import {getSelectedFeedbackData, selectFeedbackById} from "../../features/feedbackSlice";
import {VoteState} from "../../components/feedback/vote/Vote";
import {vote} from "../../helpers/feedbackHelper";
import {getFromLocalStorage} from "../../services/localstorageService";
import {FEEDBACK_USER_KEY} from "../../services/authService";

export interface FeedbackProps {
    feedbackId: string
}

const FeedbackInDetails: NextPage<FeedbackProps> = () => {
    const router = useRouter()
    const [commentTo, setCommentTo] = useState("");
    const dispatch = useAppDispatch();
    const feedback: FeedbackType = useAppSelector(selectFeedbackById);

    useEffect(() => {
        if (router.query?.id) {
            dispatch(getSelectedFeedbackData(router.query.id as string));
        }
    }, [router.query])

    const commentRef = useRef<HTMLTextAreaElement>(null);

    const handleEditFeedback = () => {
        router.push(`/feedback/edit/${router.query?.id}`);
    }

    const handleReplyComment = (a: string) => {
        if (commentRef && commentRef.current) {
            commentRef.current.focus();
        }
        setCommentTo(a);
    }

    const handleSubmitComment = async (newComment: CommentType) => {
        const author: string = getFromLocalStorage(FEEDBACK_USER_KEY);
        const commentId = await saveComment({
            authorId: author,
            text: newComment.comment,
            id: "",
            feedbackId: router.query?.id as string
        });
        await saveFeedback({...feedback, comments: [...feedback.comments, {id: commentId } as CommentType]});
        dispatch(getSelectedFeedbackData(router.query.id as string));
    }

    const handleVote = async (v: VoteState, feedback: FeedbackType) => {
        const author: string = getFromLocalStorage(FEEDBACK_USER_KEY);
        await vote(v, feedback, author);
        dispatch(getSelectedFeedbackData(router.query.id as string));
    }

    return <Box p={{base: '1rem', md: '3rem', lg: '5re m 7.5rem'}}>
        <Flex justifyContent="space-between" alignItems="center" mb="1rem">
            <GoBackLink color={colors.darkblue} />
            <Button color="white" backgroundColor="blue.500" size='md'
                    fontWeight="semibold" onClick={handleEditFeedback} >
                Edit Feedback
            </Button>
        </Flex>
        <Feedback onVote={handleVote} feedback={feedback} />
        <CommentsList onReply={handleReplyComment} comments={ feedback.comments} />
        <AddComment sendTo={commentTo} onSubmitComment={handleSubmitComment} commentRef={commentRef} />
    </Box>
}

export default FeedbackInDetails
