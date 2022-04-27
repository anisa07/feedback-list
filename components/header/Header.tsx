import {SortFeedback} from "../feedbackList/sortFeedback/SortFeedback";
import {Box, Button, Flex, Heading, Link} from "@chakra-ui/react";
import {colors} from "../../styles/colors";
import {SortType} from "../../types/SortType";

interface HeaderProps {
    title: string;
    showTitle: boolean;
    showSort: boolean;
    showNav: boolean;
    onSort?: (s: SortType) => void
}

export const Header = (props: HeaderProps) => {
    const handleSort = (s: SortType) => {
        if (props.onSort) {
            props.onSort(s);
        }
    }

    return (
        <Flex borderRadius={{md: "5px"}} backgroundColor="blue.800" mb="1.3rem" p="1rem" color="white"
              justifyContent="space-between" alignItems="center">
            <Flex justifyContent="space-between" alignItems="center">
                <Box>
                    {props.showNav && <Link fontSize="12px" color="white" href="/" mb='0.5rem' display="inline-block">
                        {"<"} Go Back
                    </Link>}
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
            <Button color="white" backgroundColor={colors.fuchsia} borderRadius="5px" py="1rem" px="1.3rem"
                    fontWeight="semibold">
                + Add Feedback
            </Button>
        </Flex>
    )
}
