import {NextPage} from "next";
import {saveComment, saveFeedback} from "../../services/feedbackService";
import {CommentType, FeedbackType, UserType} from "../../types/FeedbackType";
import {Box, Button, Flex} from "@chakra-ui/react";
import {colors} from "../../styles/colors";
import {GoBackLink} from "../../components/goBackLink/GoBackLink";
import {Feedback} from "../../components/feedback/Feedback";
import {CommentsList} from "../../components/feedback/commentsList/CommentsList";
import {AddComment} from "../../components/feedback/addComment/AddComment";
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import {useAppDispatch, useAppSelector} from "../../hooks/reduxHooks";
import {
    getSelectedFeedbackData,
    selectFeedbackById,
    selectFeedbackLoading
} from "../../features/feedbackSlice";
import {VoteState} from "../../components/feedback/vote/Vote";
import {vote} from "../../helpers/feedbackHelper";
import {getFromSessionStorage} from "../../services/storageService";
import {FEEDBACK_USER_KEY} from "../../services/authService";
import {Loading, LoadingSpinner} from "../../components/loading/Loading";
import {useErrorHandlerHook} from "../../hooks/errorHandlerHook";

export interface FeedbackProps {
    feedbackId: string
}

const FeedbackInDetails: NextPage<FeedbackProps> = () => {
    const router = useRouter();
    const { handleErrorByCode } = useErrorHandlerHook();
    const [commentTo, setCommentTo] = useState("");
    const [loadingFeedback, setLoadingFeedback] = useState(false);
    const dispatch = useAppDispatch();
    const loading: boolean = useAppSelector(selectFeedbackLoading);
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
        const author: UserType = getFromSessionStorage(FEEDBACK_USER_KEY as string);
        if (author) {
            await saveComment({
                authorId: author.id,
                text: newComment.comment,
                id: "",
                feedbackId: router.query?.id as string
            }, handleErrorByCode);
        } else {
            await router.push("/login");
            setLoadingFeedback(false);
        }
    }

    const handleVote = async (v: VoteState, feedback: FeedbackType) => {
        const author: UserType = getFromSessionStorage(FEEDBACK_USER_KEY as string);
        if (author) {
            const copyOfFeedback = await vote(v, feedback, author.id);
            setLoadingFeedback(false);
            if (copyOfFeedback) {
                await saveFeedback(copyOfFeedback, handleErrorByCode,() => {dispatch(getSelectedFeedbackData(router.query.id as string))});
                setCommentTo("");
                setLoadingFeedback(false);
            }
        } else {
            await router.push("/login");
            setLoadingFeedback(false);
        }
    }

    if (loading) {
        return <Loading />
    }

    return <Box p={{base: '1rem', md: '3rem', lg: '5re m 7.5rem'}}>
        <Flex justifyContent="space-between" alignItems="center" mb="1rem">
            <GoBackLink color={colors.darkblue} />
            <Button color="white" backgroundColor="blue.500" size='md'
                    fontWeight="semibold" onClick={handleEditFeedback} >
                Edit Feedback
            </Button>
        </Flex>
        { loadingFeedback
            ? <LoadingSpinner />
            : <>
                <Feedback onVote={handleVote} feedback={feedback} />
                <CommentsList onReply={handleReplyComment} comments={ feedback.comments} />
            </> }
        <AddComment sendTo={commentTo} onSubmitComment={handleSubmitComment} commentRef={commentRef} />
    </Box>
}

export default FeedbackInDetails
