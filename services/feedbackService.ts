import { v4 as uuidv4 } from 'uuid';
import {
    FeedbackType,
    RoadmapType,
    StatusEnum,
    Type
} from "../types/FeedbackType";

const urlApi = 'http://localhost:3001'

export const getFeedbacks = () => fetch(`${urlApi}/feedbacks`)
    .then((response) => response.json());

export const getFeedbackById = (id: string) => fetch(`${urlApi}/feedbacks/${id}`)
    .then((response) => response.json());

export const getFeedbacksByTypeId = (typeId: string) => fetch(`${urlApi}/feedbacks/?typeId=${typeId}`)
    .then((response) => response.json());

export const getStatuses = () => fetch(`${urlApi}/statuses`)
    .then((response) => response.json());

export const getTypes = () => fetch(`${urlApi}/types`)
    .then((response) => response.json());

export const getComments = () => fetch(`${urlApi}/comments`)
    .then((response) => response.json());

export const getUsers = () => fetch(`${urlApi}/users`)
    .then((response) => response.json());

export const getAuthorById = (id: string) => fetch(`${urlApi}/users/${id}`)
    .then((response) => response.json());

export const getStatus = (id: string) => fetch(`${urlApi}/statuses/${id}`)
    .then((response) => response.json());

export const getType = (id: string) => fetch(`${urlApi}/types/${id}`)
    .then((response) => response.json());

export const fillFeedback = async (item: any, withAuthor: boolean) => {
    const comments = await getComments();
    const author = withAuthor ? await getAuthorById(item.authorId) : item.authorId;
    const type = await getType(item.typeId);
    const status = await getStatus(item.statusId);
    const commentsUpdated = comments.filter((comment: any) => comment.feedbackId === item.id);
    if (withAuthor) {
        for (let [index, comment] of commentsUpdated.entries()) {
            commentsUpdated[index].author = await getAuthorById(comment.authorId);
            commentsUpdated[index].comment = commentsUpdated[index].text;
        }
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

// TODO fix types
async function fillFeedbackList(response: any[]) {
    const feedbackList: FeedbackType[] = [];

    for (const item of response) {
        const feedback = await fillFeedback(item, false);
        feedbackList.push(feedback);
    }

    return feedbackList;
}

// TODO fix response type from any to FeedbackResponseType
async function getRoadmapData(response: any) {
    const statuses = await getStatuses();
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

    return  [roadmap[StatusEnum.PLANNED], roadmap[StatusEnum.IN_PROGRESS], roadmap[StatusEnum.LIVE]]
}

export const getPageData = async (): Promise<{feedbackList: FeedbackType[], roadmap: RoadmapType[]}> => {
    const response = await getFeedbacks();

    return {
        roadmap: await getRoadmapData(response),
        feedbackList: await fillFeedbackList(response)
    };
}

export const getFeedback = async (id: string) => {
    const item = await getFeedbackById(id);
    return await fillFeedback(item, true);
}

export const getAllFeedbackList = async () => {
    const response = await getFeedbacks();
    return await fillFeedbackList(response);
}

export const getFeedbackListByType = async (id: string) => {
    const response = await getFeedbacksByTypeId(id);
    return await fillFeedbackList(response);
}

export const saveFeedback = async (feedback: FeedbackType) => {
    //TODO add proper type
    const feedbackItemSave = {
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
        return fetch(`${urlApi}/feedbacks`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(feedbackItemSave)
        })
    }

    // TODO fix response type
    const statuses = await getStatuses();
    feedbackItemSave.statusId = (statuses.find((item: any) => item.status === StatusEnum.PLANNED)).id;
    feedbackItemSave.id = uuidv4();
    return fetch(`${urlApi}/feedbacks`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedbackItemSave)
    });
}

export const saveType = async (type: Type) => {
    return fetch(`${urlApi}/types`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(type)
    })
}
