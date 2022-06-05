import {
    FeedbackType,
    RoadmapType,
    CategoryType, StatusType
} from "../types/FeedbackType";
import {getFromSessionStorage} from "./storageService";
import {FEEDBACK_USER_KEY} from "./authService";
import {CommentDto} from "../types/DtoTypes";

export const URL_API = process.env.URL_API;

export const getFeedbacks = (): Promise<FeedbackType[]> => fetch(`${URL_API}/feedback/list`)
    .then((response) => response.json());

export const getRoadmap = (): Promise<RoadmapType[]> => fetch(`${URL_API}/feedback/roadmap`)
    .then((response) => response.json());

export const getFeedbackById = (id: string): Promise<FeedbackType> => fetch(`${URL_API}/feedback/${id}`)
    .then((response) => response.json());

export const getFeedbacksByTypeId = (typeId: string): Promise<FeedbackType[]> => fetch(`${URL_API}/feedback/list/?typeId=${typeId}`)
    .then((response) => response.json());

export const getTypes = (): Promise<CategoryType[]> => fetch(`${URL_API}/feedback/type/list`)
    .then((response) => response.json());

export const saveFeedback = async (feedback: FeedbackType, handleError: (errorCode: number) => void, handleSuccess: () => void ): Promise<void> => {
    const author: {id: string, token: string} = getFromSessionStorage(FEEDBACK_USER_KEY as string);
    const savedFeedback = await fetch(`${URL_API}/feedback`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            userId: author.id,
            token: author.token
        },
        body: JSON.stringify(feedback)
    });

    if (savedFeedback.ok) {
       return handleSuccess();
    }

    return handleError(savedFeedback.status);
}

export const saveComment = async (commentToSave: CommentDto, handleError: (errorCode: number) => void): Promise<void> => {
    const author: {id: string, token: string} = getFromSessionStorage(FEEDBACK_USER_KEY as string);
    const savedComment = await fetch(`${URL_API}/feedback/comment`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            userId: author.id,
            token: author.token
        },
        body: JSON.stringify({
            ...commentToSave,
        })
    });

    return handleError(savedComment.status);
}

export const saveStatus = async (status: StatusType, handleError: (errorCode: number) => void, handleSuccess: () => void): Promise<void> => {
    const author: {id: string, token: string} = getFromSessionStorage(FEEDBACK_USER_KEY as string);
    const savedStatus = await fetch(`${URL_API}/feedback/type`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            userId: author.id,
            token: author.token
        },
        body: JSON.stringify(status)
    })

    if (savedStatus.ok) {
        return handleSuccess();
    }

    return handleError(savedStatus.status);
}

export const saveType = async (type: CategoryType, handleError: (errorCode: number) => void, handleSuccess: () => void): Promise<void> => {
    const author: {id: string, token: string} = getFromSessionStorage(FEEDBACK_USER_KEY as string);
    const savedComment = await fetch(`${URL_API}/feedback/type`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            userId: author.id,
            token: author.token
        },
        body: JSON.stringify(type)
    })

    if (savedComment.ok) {
        return handleSuccess();
    }

    return handleError(savedComment.status);
}
