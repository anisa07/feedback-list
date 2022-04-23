import {RoadmapEnum} from "./RoadmapType";

export interface FeedbackType {
    id: string,
    title: string,
    detail: string,
    vote: VoteType,
    author: AuthorType,
    comments: CommentType[],
    category: CategoryType,
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

export interface CategoryType {
    id: string,
    category: string
}

export interface StatusType {
    id: string,
    status: RoadmapEnum
}

export interface VoteType {
    voteDown: [],
    voteUp: [],
}
