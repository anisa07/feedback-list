import {Box, Button, Flex, Image, Text} from "@chakra-ui/react";
import {CommentType} from "../../../types/FeedbackType";
import {colors} from "../../../styles/colors";

interface CommentProps {
    comment: CommentType,
    onReply: (a: string) => void
}

export const Comment = (props: CommentProps) => {

    const handleReply = () => {
        props.onReply(props.comment.author.email);
    }

    return <Flex my="1.5rem">
        <Image src={props.comment.author.img} alt="comment author" boxSize='45px' borderRadius='full' mr="1rem"/>
        <Box flex="1" color={colors.darkgrayblue}>
            <Flex mb="0.5rem" justifyContent="space-between">
                <Box>
                    <Text fontWeight="semibold">{props.comment.author.name}</Text>
                    <Text fontSize="15px" color={colors.darkgray}>{props.comment.author.email}</Text>
                </Box>
                <Button variant='link' color={colors.blue} onClick={handleReply}>Reply</Button>
            </Flex>
            <Text size="md">
                {props.comment.comment}
            </Text>
        </Box>
    </Flex>
}
