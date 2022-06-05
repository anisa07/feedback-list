import {Box, Spinner} from "@chakra-ui/react";

export const Loading = () => (<Box minH="100vh" h="100%" position="relative">
    <Box position="absolute" left="50%" top="50%">
        <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
        />
    </Box>
</Box>)

export const LoadingSpinner = () => (
    <Box position="absolute" left="50%" top="50%">
        <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
        />
    </Box>
)
