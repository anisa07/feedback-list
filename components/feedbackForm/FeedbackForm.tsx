import {FeedbackType, StatusEnum, CategoryType, UserType} from "../../types/FeedbackType";
import {Flex, Button, Heading} from "@chakra-ui/react";
import { v4 as uuidv4 } from 'uuid';
import {colors} from "../../styles/colors";
import {TextField} from "../formFields/TextField";
import {TextAreaField} from "../formFields/TextAreaField";
import {useRouter} from "next/router";
import {useFormCustomHook} from "../../hooks/useFormHook";
import {FormData} from "../../types/ValidationTypes";
import {ensureNotEmpty} from "../../hooks/validationRules";
import {ChangeEvent, useEffect, useState} from "react";
import {getTypes, saveFeedback, saveType} from "../../services/feedbackService";
import { CreatableField } from "../formFields/CreatableField";
import {InputActionMeta} from "react-select";
import {UUID_REGEX} from "../../helpers/regexRules";
import {getFromSessionStorage} from "../../services/storageService";
import {FEEDBACK_USER_KEY} from "../../services/authService";
import {useErrorHandlerHook} from "../../hooks/errorHandlerHook";

interface FeedbackFormProps {
    feedback?: FeedbackType,
}

export interface Options {
    value: string,
    label: string
}

export const FeedbackForm = (props: FeedbackFormProps) => {
    const { handleErrorByCode } = useErrorHandlerHook();
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
    const [categories, setCategories] = useState<Options[]>([]);

    useEffect(() => {
        if (props.feedback) {
            const newFormData = {...formData};
            newFormData.title.value = props.feedback.title;
            newFormData.description.value = props.feedback.detail;
            newFormData.category.value = props.feedback.type.id;
            resetFormData(newFormData);
        }
    }, [props.feedback]);

    const handleUpdateCategoryList = () => {
        getTypes().then((types: CategoryType[]) => {
            const newCategories: Options[] = types.map(item => ({
                value: item.id,
                label: item.type
            }));
            setCategories(newCategories);
        })
    }

    useEffect(() => {
        handleUpdateCategoryList();
    }, []);

    const router = useRouter();

    const feedbackFormTitle = () => props.feedback ? `Editing '${props.feedback.title}'` : "Create New Feedback";

    const feedbackFormSubmitTitle = () => props.feedback ? "Edit Feedback" : "Create Feedback";

    const goBack = () => router.back();

    const handleSaveFeedback = async () => {
        const author: UserType = getFromSessionStorage(FEEDBACK_USER_KEY as string);
        if (!author) {
            await router.push("/login");
        }
        const feedbackToSave: FeedbackType = {
            id: props.feedback?.id || "",
            title: form.title.value,
            detail: form.description.value,
            vote: props.feedback?.vote || {
                voteDown: [],
                voteUp: []
            },
            author,
            comments: props.feedback?.comments || [],
            type: {
                id: form.category.value,
                type: ""
            },
            status: props.feedback?.status || {id: "", status: "" as StatusEnum}
        };
        await saveFeedback(feedbackToSave, handleErrorByCode, goBack);
    };

    const handleChange = async (v: string, actionMeta?: InputActionMeta) => {
        const event = {
            target: {
                value: "",
                name: "category"
            }
        }

        if (v && v.match(UUID_REGEX) && !actionMeta) {
            event.target.value = v;
            onChange(event as unknown as ChangeEvent<HTMLInputElement>);
            return;
        }

        if (!v && !actionMeta) {
            event.target.value = "";
            onChange(event as unknown as ChangeEvent<HTMLInputElement>);
            return;
        }

        if (actionMeta?.action === "menu-close" && actionMeta.prevInputValue && !v) {
            const newType = actionMeta.prevInputValue;
            const id = uuidv4();
            await saveType({
                id,
                type: newType
            }, handleErrorByCode, () => {
                event.target.value = id;
                onChange(event as unknown as ChangeEvent<HTMLInputElement>);
                handleUpdateCategoryList();
            });
        }
    }

    return <form>
        <Heading color={colors.darkgrayblue} as='h3' size='lg' mb={{base: "1rem", md: "2rem"}}>
            {feedbackFormTitle()}
        </Heading>
        <TextField
            name="title"
            value={form.title.value}
            label="Feedback Title"
            errorMessage={form.title.errorMessage}
            onChange={onChange}
        />
        <CreatableField
            defaultValue={props.feedback?.type?.id || ""}
            label="Category"
            errorMessage={form.category.errorMessage}
            options={categories}
            onChangeCreateField={handleChange}
        />
        <TextAreaField
            name="description"
            value={form.description.value}
            label="Feedback Description"
            errorMessage={form.description.errorMessage}
            onChange={onChange}
        />
        <Flex justifyContent="flex-end">
            <Button color="white" backgroundColor={colors.darkgray} size='md' mr="0.5rem"
                    fontWeight="semibold" onClick={goBack}>
                Cancel
            </Button>
            <Button disabled={!isValid()} color="white" backgroundColor={colors.fuchsia} size='md'
                    fontWeight="semibold" onClick={handleSaveFeedback}>
                {feedbackFormSubmitTitle()}
            </Button>
        </Flex>
    </form>
}
