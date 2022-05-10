import {v4 as uuidv4} from 'uuid';
import {
    FeedbackType,
    RoadmapType,
    StatusEnum,
    CategoryType, StatusType, CommentType, UserType
} from "../types/FeedbackType";
import {CommentDto, FeedbackDto} from "../types/DtoTypes";

const urlApi = 'http://localhost:3001'

export const getFeedbacks = (): Promise<FeedbackDto[]> => fetch(`${urlApi}/feedbacks`)
    .then((response) => response.json());

export const getFeedbackById = (id: string): Promise<FeedbackDto> => fetch(`${urlApi}/feedbacks/${id}`)
    .then((response) => response.json());

export const getFeedbacksByTypeId = (typeId: string): Promise<FeedbackDto[]> => fetch(`${urlApi}/feedbacks/?typeId=${typeId}`)
    .then((response) => response.json());

export const getStatuses = (): Promise<StatusType[]> => fetch(`${urlApi}/statuses`)
    .then((response) => response.json());

export const getStatus = (id: string): Promise<StatusType> => fetch(`${urlApi}/statuses/${id}`)
    .then((response) => response.json());

export const getTypes = (): Promise<CategoryType[]> => fetch(`${urlApi}/types`)
    .then((response) => response.json());

export const getType = (id: string): Promise<CategoryType> => fetch(`${urlApi}/types/${id}`)
    .then((response) => response.json());

export const getComments = (): Promise<CommentDto[]> => fetch(`${urlApi}/comments`)
    .then((response) => response.json());

export const getUsers = (): Promise<UserType[]> => fetch(`${urlApi}/users`)
    .then((response) => response.json());

export const getAuthorById = (id: string): Promise<UserType> => fetch(`${urlApi}/users/${id}`)
    .then((response) => response.json());

export const fillFeedback = async (item: FeedbackDto) => {
    const comments: CommentDto[] = await getComments();
    const author = await getAuthorById(item.authorId);
    const type = await getType(item.typeId);
    const status: StatusType = await getStatus(item.statusId);
    const commentsUpdated: CommentType[] = []
    const commentsPerFeedback: CommentDto[] = comments.filter((comment) => comment.feedbackId === item.id);

    for (let comment of commentsPerFeedback) {
        const author = await getAuthorById(comment.authorId);
        commentsUpdated.push({
            id: comment.id,
            comment: comment.text,
            author
        })
    }

    return {
        id: item.id,
        title: item.title,
        detail: item.detail,
        vote: item.vote,
        author,
        comments: commentsUpdated,
        type,
        status
    };
}

async function fillFeedbackList(response: FeedbackDto[]): Promise<FeedbackType[]> {
    const feedbackList: FeedbackType[] = [];

    for (const item of response) {
        const feedback = await fillFeedback(item);
        feedbackList.push(feedback);
    }

    return feedbackList;
}

async function getRoadmapData(response: FeedbackDto[]): Promise<RoadmapType[]> {
    const statuses: StatusType[] = await getStatuses();
    const roadmap: Record<string, RoadmapType> = {
        [StatusEnum.PLANNED]: {} as RoadmapType,
        [StatusEnum.IN_PROGRESS]: {} as RoadmapType,
        [StatusEnum.LIVE]: {} as RoadmapType
    };
    for (const item of statuses) {
        roadmap[item.status] = {...item, quantity: 0};
    }

    for (const item of response) {
        const status = await getStatus(item.statusId);
        roadmap[status.status].quantity += 1;
    }

    return [roadmap[StatusEnum.PLANNED], roadmap[StatusEnum.IN_PROGRESS], roadmap[StatusEnum.LIVE]]
}

export const getFeedbackData = async (): Promise<{ feedbackList: FeedbackType[], roadmap: RoadmapType[] }> => {
    const response: FeedbackDto[] = await getFeedbacks();

    return {
        roadmap: await getRoadmapData(response),
        feedbackList: await fillFeedbackList(response)
    };
}

export const getFeedback = async (id: string): Promise<FeedbackType> => {
    const item: FeedbackDto = await getFeedbackById(id);
    return await fillFeedback(item);
}

export const getAllFeedbacks = async (): Promise<FeedbackType[]> => {
    const response: FeedbackDto[] = await getFeedbacks();
    return await fillFeedbackList(response);
}

export const getFeedbackListByType = async (id: string): Promise<FeedbackType[]> => {
    const response: FeedbackDto[] = await getFeedbacksByTypeId(id);
    return await fillFeedbackList(response);
}

export const saveFeedback = async (feedback: FeedbackType): Promise<Response> => {
    const feedbackItemSave: FeedbackDto = {
        id: "",
        statusId: feedback.status.id,
        title: feedback.title,
        detail: feedback.detail,
        vote: feedback.vote,
        commentIds: [] as string[],
        typeId: feedback.type.id,
        authorId: feedback.author.id,
    }

    if (feedback.id) {
        feedbackItemSave.id = feedback.id;
        feedbackItemSave.commentIds = feedback.comments.map(item => item.id);
        return fetch(`${urlApi}/feedbacks/${feedback.id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(feedbackItemSave)
        })
    }

    const statuses: StatusType[] = await getStatuses();
    feedbackItemSave.statusId = (statuses.find((item: any) => item.status === StatusEnum.PLANNED))?.id || "";
    feedbackItemSave.id = uuidv4();
    return fetch(`${urlApi}/feedbacks`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedbackItemSave)
    });
}

export const saveComment = async (commentToSave: CommentDto): Promise<string> => {
    const id = uuidv4();
    await fetch(`${urlApi}/comments`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...commentToSave,
            id
        })
    });
    return id;
}

export const saveType = async (type: CategoryType): Promise<Response> => {
    return fetch(`${urlApi}/types`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(type)
    })
}
