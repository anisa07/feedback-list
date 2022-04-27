export enum StatusEnum {
    PLANNED = "Planned",
    IN_PROGRESS = "InProgress",
    LIVE = "Live"
}

export interface FeedbackType {
    id: string,
    title: string,
    detail: string,
    vote: VoteType,
    author: AuthorType,
    comments: CommentType[],
    type: Type,
    status: StatusType
}

export interface AuthorType {
    id: string,
    name: string,
    email: string,
    img: string,
}

export interface CommentType {
    id: string,
    comment: string,
    author: AuthorType,
}

export interface Type {
    id: string,
    type: string
}

export interface StatusType {
    id: string,
    status: StatusEnum
}

export interface RoadmapType {
    id: string,
    status: StatusEnum,
    description: string,
    quantity: number
}

export interface VoteType {
    voteDown: [],
    voteUp: [],
}
