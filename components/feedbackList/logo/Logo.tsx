import {Flex, Heading, Text} from "@chakra-ui/react";

interface LogoProps {
    title: string;
    text: string;
}

export const Logo = (props: LogoProps) => {
    return (
        <Flex p='1.5rem'
              pt={{
                  md: '2rem'
              }}
              borderRadius={{
                  md: '5px'
              }}
              bgGradient='linear(to-br, blue.300, purple.400, pink.400, orange.300)'
              color='white'
              direction='column'
              justifyContent={{
                  md: 'justify-end'
              }}
              mr={{
                  lg: 0,
                  md: '1.5rem'
              }}
              mb={{
                  md: '1.5rem'
              }}
              flex={{
                  base: 1,
                  lg: "unset"
              }}
        >
            <Heading as='h1' size='md'>{props.title}</Heading>
            <Text>{props.text}</Text>
        </Flex>
    )
}
