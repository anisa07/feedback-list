import {UserType} from "../types/FeedbackType";
import {urlApi} from "./feedbackService";
import {saveToLocalStorage} from "./localstorageService";

interface LoginDataDto {
    email: string,
    password: string
}

export const FEEDBACK_USER_KEY = "__feedback_user_key"

export const getUserByEmail = (email: string): Promise<UserType[]> => fetch(`${urlApi}/users/?email=${email}`)
    .then((response) => response.json());

export const sendAuthData = async ({email, password}: LoginDataDto) => {
    const userFromDb = await getUserByEmail(email);

    if (!userFromDb) {
        throw Error("User does not exist!");
    }

    // TODO fix encryption
    if (password !== userFromDb[0].password) {
        throw Error("Password is incorrect!");
    }

    saveToLocalStorage(FEEDBACK_USER_KEY, userFromDb[0].id);
}
