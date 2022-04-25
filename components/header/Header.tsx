import {SortFeedback} from "../feedbackList/sortFeedback/SortFeedback";
import {Button, Flex, Heading} from "@chakra-ui/react";
import {colors} from "../../styles/colors";

interface HeaderProps {
    title: string;
}

export const Header = (props: HeaderProps) => {
    return (
        <Flex borderRadius={{md: "5px"}} backgroundColor="blue.800" mb="1.3rem" p="1rem" color="white" justifyContent="space-between" alignItems="center">
            <Flex justifyContent="space-between" alignItems="center">
                <Heading as="h3" size="sm" fontWeight="bold" mr="1rem">
                    {props.title}
                </Heading>
                <SortFeedback sortItems={["Most Upvotes", "Most Discussed", "Less Upvotes", "Less Discussed"]} onSort={(i:string)=>{}}/>
            </Flex>
            <Button color="white" backgroundColor={colors.fuchsia} borderRadius="5px" py="1rem" px="1.3rem" fontWeight="semibold">
                + Add Feedback
            </Button>
        </Flex>
    )
}
