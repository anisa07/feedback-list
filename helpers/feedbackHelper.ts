import {FeedbackType} from "../types/FeedbackType";
import {SortType} from "../types/SortType";

export const sortMostUpVotes = (feedbackList: FeedbackType[]) => (
    feedbackList.sort((a, b) =>
        (b.vote.voteUp.length - b.vote.voteDown.length) - (a.vote.voteUp.length - a.vote.voteDown.length)
    )
)

export const sortMostDownVotes = (feedbackList: FeedbackType[]) => (
    feedbackList.sort((a, b) =>
        (a.vote.voteUp.length - a.vote.voteDown.length) - (b.vote.voteUp.length - b.vote.voteDown.length)
    )
)

export const sortMostDiscussed = (feedbackList: FeedbackType[]) => (
    feedbackList.sort((a, b) => (
        b.comments.length - a.comments.length
    ))
)

export const sortLessDiscussed = (feedbackList: FeedbackType[]) => (
    feedbackList.sort((a, b) => (
        a.comments.length - b.comments.length
    ))
)

export const sortBy = (feedbackList: FeedbackType[], s?: SortType) => {
    switch (s) {
        case SortType.UpVotes:
            return sortMostUpVotes(feedbackList);
        case SortType.DownVotes:
            return sortMostDownVotes(feedbackList);
        case SortType.MostDiscussed:
            return sortMostDiscussed(feedbackList);
        case SortType.LessDiscussed:
            return sortLessDiscussed(feedbackList);
        default:
            return feedbackList;
    }
}
