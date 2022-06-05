import {URL_API} from "./feedbackService";
import {saveToSessionStorage} from "./storageService";

interface LoginDataDto {
    email: string,
    password: string
}

interface SignupDataDto {
    email: string,
    name: string,
    password: string,
    img?: string
}

export const FEEDBACK_USER_KEY = process.env.FEEDBACK_USER_KEY;

export const signup = async (data: SignupDataDto, handleError: (msg: string) => void) => {
    const signupResult = await fetch(`${URL_API}/user/signup`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    switch (signupResult.status) {
        case 400:
            handleError("User already exists or data is incorrect");
    }
}

export const login = async (data: LoginDataDto, handleError: (msg: string) => void) => {
    const loginResult = await fetch(`${URL_API}/user/login`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (loginResult.ok) {
        const json = await loginResult.json();
        saveToSessionStorage(FEEDBACK_USER_KEY as string, json);
        return loginResult;
    }

    switch (loginResult.status) {
        case 400:
            handleError("User already exists or data is incorrect");
            break;
        case 404:
            handleError("User not found");
            break;
    }
}
