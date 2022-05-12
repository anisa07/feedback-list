import {Flex, Button, Heading} from "@chakra-ui/react";
import {colors} from "../../styles/colors";
import {TextField} from "../formFields/TextField";
import {useRouter} from "next/router";
import {useFormCustomHook} from "../../hooks/useFormHook";
import {FormData} from "../../types/ValidationTypes";
import {ensureNotEmpty} from "../../hooks/validationRules";
import {useEffect, useState} from "react";
import {sendAuthData} from "../../services/authService";

export const LoginForm = () => {
    const [loginError, setLoginError] = useState("");
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
    const { onChange, isValid, form, resetFormData } = useFormCustomHook(formData);

    useEffect(() => {

    }, []);

    const router = useRouter();

    const goBack = () => router.back();

    const handleLogin = async () => {
        try {
            await sendAuthData({email: form.email.value, password: form.password.value});
            goBack();
        } catch (e) {
            // TODO implement behavior, notification?
            console.error("Cannot Login")
        }
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
            name="password"
            value={form.password.value}
            label="Password"
            errorMessage={form.password.errorMessage}
            onChange={onChange}
        />
        <Flex justifyContent="flex-end">
            <Button disabled={!isValid()} color="white" backgroundColor={colors.fuchsia} size='md'
                    fontWeight="semibold" onClick={handleLogin}>
                Login
            </Button>
        </Flex>
    </form>
}
