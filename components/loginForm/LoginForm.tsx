import {Flex, Button, Heading, Text, Box, Link} from "@chakra-ui/react";
import {colors} from "../../styles/colors";
import {TextField} from "../formFields/TextField";
import {useRouter} from "next/router";
import {useFormCustomHook} from "../../hooks/useFormHook";
import {FormData} from "../../types/ValidationTypes";
import {ensureNotEmpty} from "../../hooks/validationRules";
import {login} from "../../services/authService";
import {useErrorHandlerHook} from "../../hooks/errorHandlerHook";

export const LoginForm = () => {
    const { handleErrorMessage } = useErrorHandlerHook();
    const formData: FormData = {
        email: {
            errorMessage: "",
            value: "",
            error: false,
            validation: [ensureNotEmpty]
        },
        password: {
            errorMessage: "",
            value: "",
            error: false,
            validation: [ensureNotEmpty]
        },
    };
    const { onChange, isValid, form } = useFormCustomHook(formData);

    const router = useRouter();

    const goBack = () => router.back();

    const handleLogin = async () => {
        await login({email: form.email.value, password: form.password.value}, handleErrorMessage);
        goBack();
    };

    return <form>
        <Heading color={colors.darkgrayblue} as='h3' size='lg' mb={{base: "1rem", md: "2rem"}}>
            Login
        </Heading>
        <TextField
            name="email"
            value={form.email.value}
            label="Email"
            errorMessage={form.email.errorMessage}
            onChange={onChange}
        />
        <TextField
            type="password"
            name="password"
            value={form.password.value}
            label="Password"
            errorMessage={form.password.errorMessage}
            onChange={onChange}
        />
        <Flex justifyContent="flex-end" alignItems="center">
            <Link mr="0.5rem" href="/signup">Have no account yet?</Link>
            <Button disabled={!isValid()} color="white" backgroundColor={colors.fuchsia} size='md'
                    fontWeight="semibold" onClick={handleLogin}>
                Login
            </Button>
        </Flex>
    </form>
}
