import {FeedbackForm} from "../../components/feedbackForm/FeedbackForm";
import {Box} from "@chakra-ui/react";
import {GoBackLink} from "../../components/goBackLink/GoBackLink";
import {colors} from "../../styles/colors";

function CreateFeedback() {
    return <Box p={{base: '1rem', md: '5rem 7.5rem'}}>
        <Box mb="1rem">
            <GoBackLink color={colors.darkblue} />
        </Box>
        <Box backgroundColor="white" borderRadius="2px" p={{base: "1rem", md: "2rem"}}>
            <FeedbackForm />
        </Box>
    </Box>
}

export default CreateFeedback
