import {Box} from "@chakra-ui/react";
import {SignupForm} from "../components/signupForm/SignupForm";

function Signup() {
    return (<Box p={{base: '1rem', md: '5rem 7.5rem'}}>
        <Box backgroundColor="white" borderRadius="2px" p={{base: "1rem", md: "2rem"}}>
            <SignupForm />
        </Box>
    </Box>)
}

export default Signup
