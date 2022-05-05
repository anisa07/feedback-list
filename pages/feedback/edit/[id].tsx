import {GetServerSideProps, NextPage} from "next";
import {getFeedback} from "../../../services/feedbackService";
import {FeedbackProps} from "../[id]";
import {FeedbackForm} from "../../../components/feedbackForm/FeedbackForm";
import {Box} from "@chakra-ui/react";
import {GoBackLink} from "../../../components/goBackLink/GoBackLink";
import {colors} from "../../../styles/colors";

const EditFeedback: NextPage<FeedbackProps> = (props: FeedbackProps) => {
    return <Box p={{base: '1rem', md: '5rem 7.5rem'}}>
        <Box mb="1rem">
            <GoBackLink color={colors.darkblue} />
        </Box>
        <Box backgroundColor="white" borderRadius="2px" p={{base: "1rem", md: "2rem"}}>
            <FeedbackForm feedback={props.feedback} />
        </Box>
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

export default EditFeedback
