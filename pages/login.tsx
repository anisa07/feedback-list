import { Box } from "@chakra-ui/react";
import {LoginForm} from "../components/loginForm/LoginForm";

function Login() {
    return (<Box p={{base: '1rem', md: '5rem 7.5rem'}}>
        <Box backgroundColor="white" borderRadius="2px" p={{base: "1rem", md: "2rem"}}>
            <LoginForm />
        </Box>
    </Box>)
}

export default Login
