import {FeedbackType} from "../../types/FeedbackType";
import {Flex, Button, Heading} from "@chakra-ui/react";
import {colors} from "../../styles/colors";
import {TextField} from "../formFields/TextField";
import {SelectField} from "../formFields/SelectField";
import {TextAreaField} from "../formFields/TextAreaField";
import { CategoryOptions } from "../../pages/feedback/create";
import {useRouter} from "next/router";

interface FeedbackFormProps {
    feedback?: FeedbackType,
    categories: CategoryOptions[]
}

export const FeedbackForm = (props: FeedbackFormProps) => {
    const router = useRouter();

    const feedbackFormTitle = () => props.feedback ? `Editing '${props.feedback.title}'` : "Create New Feedback";

    const feedbackFormSubmitTitle = () => props.feedback ? "Edit Feedback" : "Create Feedback";

    const goBack = () => router.back();

    return <form>
        <Heading color={colors.darkgrayblue} as='h3' size='lg' mb={{base: "1rem", md: "2rem"}}>
            {feedbackFormTitle()}
        </Heading>
        <TextField
            value={""}
            label={"Feedback Title"}
            errorMessage={""}
            onChange={() => {}} />
        <SelectField
            value={""}
            label={"Category"}
            errorMessage={""}
            options={props.categories}
            onChange={() => {}}
        />
        <TextAreaField
            value={""}
            label={"Feedback Description"}
            errorMessage={""}
            onChange={() => {}} />
        <Flex justifyContent="flex-end">
            <Button color="white" backgroundColor={colors.darkgray} size='md' mr="0.5rem"
                    fontWeight="semibold" onClick={goBack}>
                Cancel
            </Button>
            <Button color="white" backgroundColor={colors.fuchsia} size='md'
                    fontWeight="semibold" onClick={() => {}}>
                {feedbackFormSubmitTitle()}
            </Button>
        </Flex>
    </form>
}
