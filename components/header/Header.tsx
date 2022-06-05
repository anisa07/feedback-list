import {SortFeedback} from "../feedbackList/sortFeedback/SortFeedback";
import {Box, Button, Flex, Heading} from "@chakra-ui/react";
import { useRouter } from 'next/router'
import {colors} from "../../styles/colors";
import {SortType} from "../../types/SortType";
import {GoBackLink} from "../goBackLink/GoBackLink";
import {getFromSessionStorage} from "../../services/storageService";
import {FEEDBACK_USER_KEY} from "../../services/authService";

interface HeaderProps {
    title: string;
    showTitle: boolean;
    showSort: boolean;
    showNav: boolean;
    onSort?: (s: SortType) => void
}

export const Header = (props: HeaderProps) => {
    const router = useRouter();

    const handleSort = (s: SortType) => {
        if (props.onSort) {
            props.onSort(s);
        }
    }

    const handleAddFeedback = async () => {
        const author: string = getFromSessionStorage(FEEDBACK_USER_KEY as string);
        if (author) {
            await router.push('/feedback/create');
        } else {
            await router.push("/login");
        }
    }

    return (
        <Flex borderRadius={{md: "5px"}} backgroundColor="blue.800" mb="1.3rem" p="1rem" color="white"
              justifyContent="space-between" alignItems="center">
            <Flex justifyContent="space-between" alignItems="center">
                <Box>
                    {props.showNav && <GoBackLink color="white" />}
                    {props.showTitle && <Heading as="h3" size="sm" fontWeight="bold" mr="1rem">
                        {props.title}
                    </Heading>}
                </Box>
                {props.showSort && <SortFeedback
                    sortItems={[
                        SortType.UpVotes, SortType.MostDiscussed, SortType.DownVotes, SortType.LessDiscussed
                    ]}
                    onSort={handleSort}/>}
            </Flex>
            <Button color="white" backgroundColor={colors.fuchsia} size='md'
                    fontWeight="semibold" onClick={handleAddFeedback}>
                + Add Feedback
            </Button>
        </Flex>
    )
}
