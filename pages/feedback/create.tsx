import {FeedbackForm} from "../../components/feedbackForm/FeedbackForm";
import {Box} from "@chakra-ui/react";
import {GoBackLink} from "../../components/goBackLink/GoBackLink";
import {colors} from "../../styles/colors";
import {GetStaticProps} from "next";
import { getTypes } from "../../services/feedbackService";
import {Type} from "../../types/FeedbackType";

export interface CategoryOptions {
    value: string,
    label: string
}

interface CreateFeedbackProps {
    categories: CategoryOptions[]
}

function CreateFeedback(props: CreateFeedbackProps) {
    return <Box p={{base: '1rem', md: '5rem 7.5rem'}}>
        <Box mb="1rem">
            <GoBackLink color={colors.darkblue} />
        </Box>
        <Box backgroundColor="white" borderRadius="2px" p={{base: "1rem", md: "2rem"}}>
            <FeedbackForm categories={props.categories} />
        </Box>
    </Box>
}

export const getServerSideProps: GetStaticProps<CreateFeedbackProps> = async () => {
    const types: Type[] = await getTypes();
    const categories = [{value: "", label: ""} , ...types.map(item => ({
        value: item.id,
        label: item.type
    }))]

    return {
        props: {
            categories
        }
    }
}


export default CreateFeedback
