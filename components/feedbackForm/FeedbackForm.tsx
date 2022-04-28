import {FeedbackType} from "../../types/FeedbackType";
import {Flex, Button, Heading} from "@chakra-ui/react";
import {colors} from "../../styles/colors";
import {TextField} from "../formFields/TextField";
import {SelectField} from "../formFields/SelectField";
import {TextAreaField} from "../formFields/TextAreaField";
import { CategoryOptions } from "../../pages/feedback/create";
import {useRouter} from "next/router";
import {useFormCustomHook} from "../../hooks/useFormHook";
import {FormData} from "../../types/ValidationTypes";
import {ensureNotEmpty} from "../../hooks/validationRules";
import {useEffect} from "react";

interface FeedbackFormProps {
    feedback?: FeedbackType,
    categories: CategoryOptions[]
}

export const FeedbackForm = (props: FeedbackFormProps) => {
    const formData: FormData = {
        title: {
            errorMessage: "",
            value: "",
            error: false,
            validation: [ensureNotEmpty]
        },
        category: {
            errorMessage: "",
            value: "",
            error: false,
            validation: [ensureNotEmpty]
        },
        description: {
            errorMessage: "",
            value: "",
            error: false,
            validation: [ensureNotEmpty]
        }
    };
    const { onChange, isValid, form, resetFormData } = useFormCustomHook(formData);

    useEffect(() => {
        if (props.feedback) {
            const newFormData = {...formData};
            newFormData.title.value = props.feedback.title;
            newFormData.description.value = props.feedback.detail;
            newFormData.category.value = props.feedback.type.id;
            resetFormData(newFormData);
        }
    }, [props.feedback])

    const router = useRouter();

    const feedbackFormTitle = () => props.feedback ? `Editing '${props.feedback.title}'` : "Create New Feedback";

    const feedbackFormSubmitTitle = () => props.feedback ? "Edit Feedback" : "Create Feedback";

    const goBack = () => router.back();

    return <form>
        <Heading color={colors.darkgrayblue} as='h3' size='lg' mb={{base: "1rem", md: "2rem"}}>
            {feedbackFormTitle()}
        </Heading>
        <TextField
            name="title"
            value={form.title.value}
            label={"Feedback Title"}
            errorMessage={form.title.errorMessage}
            onChange={onChange}
        />
        <SelectField
            name="category"
            value={form.category.value}
            label={"Category"}
            errorMessage={form.category.errorMessage}
            options={props.categories}
            onChange={onChange}
        />
        <TextAreaField
            name="description"
            value={form.description.value}
            label={"Feedback Description"}
            errorMessage={form.description.errorMessage}
            onChange={onChange}
        />
        <Flex justifyContent="flex-end">
            <Button color="white" backgroundColor={colors.darkgray} size='md' mr="0.5rem"
                    fontWeight="semibold" onClick={goBack}>
                Cancel
            </Button>
            <Button disabled={!isValid()} color="white" backgroundColor={colors.fuchsia} size='md'
                    fontWeight="semibold" onClick={() => {}}>
                {feedbackFormSubmitTitle()}
            </Button>
        </Flex>
    </form>
}
