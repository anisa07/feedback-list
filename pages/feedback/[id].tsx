import {GetServerSideProps, NextPage} from "next";
import {getFeedback} from "../../services/feedbackService";
import {FeedbackType} from "../../types/FeedbackType";
import {Box, Button, Flex} from "@chakra-ui/react";
import {colors} from "../../styles/colors";
import {GoBackLink} from "../../components/goBackLink/GoBackLink";
import {Feedback} from "../../components/feedback/Feedback";
import {CommentsList} from "../../components/feedback/commentsList/CommentsList";

interface FeedbackProps {
    feedback: FeedbackType
}

const FeedbackInDetails: NextPage<FeedbackProps> = (props: FeedbackProps) => {
    // console.log(props.feedback)

    const handleEditFeedback = () => {}

    return <Box p={{base: '1rem', md: '3rem', lg: '5rem 7.5rem'}}>
        <Flex justifyContent="space-between" alignItems="center" mb="1rem">
            <GoBackLink color={colors.darkblue} />
            <Button color="white" backgroundColor="blue.500" size='md'
                    fontWeight="semibold" onClick={handleEditFeedback}>
                Edit Feedback
            </Button>
        </Flex>
        <Feedback feedback={props.feedback} />
        <CommentsList comments={props.feedback.comments} />
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
