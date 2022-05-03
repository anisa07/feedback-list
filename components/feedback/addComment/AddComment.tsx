import {Box, Button, Flex, Heading, Textarea, Text} from "@chakra-ui/react"
import {ChangeEvent, Ref, useEffect} from "react";
import {FormData} from "../../../types/ValidationTypes";
import {ensureMaxLength, ensureNotEmpty} from "../../../hooks/validationRules";
import {useFormCustomHook} from "../../../hooks/useFormHook";
import {colors} from "../../../styles/colors";
import { MAX_LENGTH } from "../../../helpers/regexRules";

interface AddCommentProps {
    sendTo: string;
    commentRef: Ref<HTMLTextAreaElement>,
    onSubmitComment: () => void
}

export const AddComment = (props: AddCommentProps) => {
    const formData: FormData = {
        comment: {
            errorMessage: "",
            value: "",
            error: false,
            validation: [ensureNotEmpty, ensureMaxLength]
        },
    };
    const { onChange, isValid, form, resetFormData } = useFormCustomHook(formData);

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(event as unknown as ChangeEvent<HTMLInputElement>);
    }

    const countLeftLength = () => MAX_LENGTH >= form.comment.value.length ? MAX_LENGTH - form.comment.value.length : 0;

    useEffect(() => {
        if (props.sendTo) {
            resetFormData({comment: {
                ...formData.comment,
                value: props.sendTo
            }})
        }
    }, [props.sendTo])

    return (
        <Box backgroundColor="white" borderRadius="5px" p="2rem">
            <Heading as="h4" size="md" fontWeight="semibold">
                Add Comment
            </Heading>
            <form>
                <Textarea
                    ref={props.commentRef}
                    name="comment"
                    value={form.comment.value}
                    my="1rem"
                    placeholder='Type your comment here...'
                    size='md'
                    resize="none"
                    onChange={handleChange}
                />
                <Flex justifyContent="space-between">
                    <Text fontSize="14px" color={colors.darkgray}>{`${countLeftLength()} characters left`}</Text>
                    <Button color="white" backgroundColor={colors.fuchsia} disabled={!isValid()}>Post Comment</Button>
                </Flex>
            </form>
        </Box>
    )
}
