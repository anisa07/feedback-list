import {FeedbackType, RoadmapType, StatusEnum} from "../types/FeedbackType";

const urlApi = 'http://localhost:3001'

export const getFeedbacks = () => fetch(`${urlApi}/feedbacks`)
    .then((response) => response.json());

export const getStatuses = () => fetch(`${urlApi}/statuses`)
    .then((response) => response.json());

export const getTypes = () => fetch(`${urlApi}/types`)
    .then((response) => response.json());

export const getComments = () => fetch(`${urlApi}/comments`)
    .then((response) => response.json());

export const getUsers = () => fetch(`${urlApi}/users`)
    .then((response) => response.json());

export const getFeedbackAuthor = (id: string) => fetch(`${urlApi}/users/${id}`)
    .then((response) => response.json());

export const getStatus = (id: string) => fetch(`${urlApi}/statuses/${id}`)
    .then((response) => response.json());

export const getType = (id: string) => fetch(`${urlApi}/types/${id}`)
    .then((response) => response.json());

export const getHomePageData = async (): Promise<{feedbackList: FeedbackType[], roadmap: RoadmapType[]}> => {
    const response = await getFeedbacks();
    const feedbackList: FeedbackType[] = [];
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
        const author = await getFeedbackAuthor(item.authorId);
        const comments = await getComments();
        const type = await getType(item.typeId);
        const status = await getStatus(item.statusId);
        const feedback = {
            id: item.id,
            title: item.title,
            detail: item.detail,
            vote: item.vote,
            author,
            comments,
            type,
            status
        };
        feedbackList.push(feedback);
        roadmap[status.status].quantity += 1;
    }
    return {
        feedbackList,
        roadmap: Object.values(roadmap)
    };
}
