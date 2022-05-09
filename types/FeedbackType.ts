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
    author: UserType,
    comments: CommentType[],
    type: CategoryType,
    status: StatusType
}

export interface UserType {
    id: string,
    name: string,
    email: string,
    img: string,
}

export interface CommentType {
    id: string,
    comment: string,
    author: UserType,
}

export interface CategoryType {
    id: string,
    type: string
}

export interface StatusType {
    id: string,
    status: StatusEnum,
    description?: string,
}

export interface RoadmapType extends StatusType{
    quantity: number
}

export interface VoteType {
    voteDown: [],
    voteUp: [],
}
