import {Flex, Button, Heading, Text, Box} from "@chakra-ui/react";
import {colors} from "../../styles/colors";
import {TextField} from "../formFields/TextField";
import {useRouter} from "next/router";
import {useFormCustomHook} from "../../hooks/useFormHook";
import {FormData} from "../../types/ValidationTypes";
import {ensureEmail, ensureNotEmpty, ensurePasswordsAreEqual} from "../../hooks/validationRules";
import {useState} from "react";
import {signup} from "../../services/authService";
import {GoBackLink} from "../goBackLink/GoBackLink";
import {useErrorHandlerHook} from "../../hooks/errorHandlerHook";

export const SignupForm = () => {
    const { handleErrorMessage } = useErrorHandlerHook();
    const formData: FormData = {
        name: {
            errorMessage: "",
            value: "",
            error: false,
            validation: [ensureNotEmpty]
        },
        img: {
            errorMessage: "",
            value: "",
            error: false,
            validation: []
        },
        email: {
            errorMessage: "",
            value: "",
            error: false,
            validation: [ensureNotEmpty, ensureEmail]
        },
        password: {
            errorMessage: "",
            value: "",
            error: false,
            validation: [ensureNotEmpty]
        },
        repeatPassword: {
            errorMessage: "",
            value: "",
            error: false,
            validation: [ensureNotEmpty, ensurePasswordsAreEqual]
        },
    };
    const { onChange, isValid, form } = useFormCustomHook(formData);

    const router = useRouter();

    const goBack = () => router.back();

    const handleSignup = async () => {
        await signup({
            name: form.name.value,
            email: form.email.value,
            password: form.password.value,
            img: form.img.value || "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg"
        }, handleErrorMessage);
        goBack();
    };

    return <form>
        <Heading color={colors.darkgrayblue} as='h3' size='lg' mb={{base: "1rem", md: "2rem"}}>
            Signup
        </Heading>
        <TextField
            name="name"
            value={form.name.value}
            label="Name"
            errorMessage={form.name.errorMessage}
            onChange={onChange}
        />
        <TextField
            name="email"
            value={form.email.value}
            label="Email"
            errorMessage={form.email.errorMessage}
            onChange={onChange}
        />
        <TextField
            name="img"
            value={form.img.value}
            label="Avatar Image URL"
            errorMessage={form.img.errorMessage}
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
        <TextField
            type="password"
            name="repeatPassword"
            value={form.repeatPassword.value}
            label="Repeat Password"
            errorMessage={form.repeatPassword.errorMessage}
            onChange={onChange}
        />
        <Flex justifyContent="flex-end" alignItems="center">
            <GoBackLink color={colors.darkblue} />
            <Button disabled={!isValid()} color="white" backgroundColor={colors.fuchsia} size='md'
                    fontWeight="semibold" onClick={handleSignup}>
                Signup
            </Button>
        </Flex>
    </form>
}
