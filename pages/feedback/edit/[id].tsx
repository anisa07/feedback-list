import {NextPage} from "next";
import {FeedbackProps} from "../[id]";
import {FeedbackForm} from "../../../components/feedbackForm/FeedbackForm";
import {Box} from "@chakra-ui/react";
import {GoBackLink} from "../../../components/goBackLink/GoBackLink";
import {colors} from "../../../styles/colors";
import {FeedbackType} from "../../../types/FeedbackType";
import {useAppDispatch, useAppSelector} from "../../../hooks/reduxHooks";
import {getSelectedFeedbackData, selectFeedbackById, selectFeedbackLoading} from "../../../features/feedbackSlice";
import {useEffect} from "react";
import {useRouter} from "next/router";
import {Loading} from "../../../components/loading/Loading";

const EditFeedback: NextPage<FeedbackProps> = () => {
    const router = useRouter()
    const dispatch = useAppDispatch();
    const feedback: FeedbackType = useAppSelector(selectFeedbackById);
    const loading: boolean = useAppSelector(selectFeedbackLoading);

    useEffect(() => {
        if (router.query?.id) {
            dispatch(getSelectedFeedbackData(router.query?.id as string));
        }
    }, [router.query])

    if (loading) {
        return <Loading />
    }

    return <Box p={{base: '1rem', md: '5rem 7.5rem'}}>
        <Box mb="1rem">
            <GoBackLink color={colors.darkblue} />
        </Box>
        <Box backgroundColor="white" borderRadius="2px" p={{base: "1rem", md: "2rem"}}>
            <FeedbackForm feedback={feedback} />
        </Box>
    </Box>
}

export default EditFeedback
