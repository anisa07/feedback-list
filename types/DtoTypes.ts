import {VoteType} from "./FeedbackType";

export interface FeedbackDto {
    id: string,
    statusId: string,
    title: string,
    detail: string,
    vote: VoteType,
    commentIds: string[],
    typeId: string,
    authorId: string
}

export interface CommentDto {
    id: string,
    authorId: string,
    text: string
    feedbackId: string
}
