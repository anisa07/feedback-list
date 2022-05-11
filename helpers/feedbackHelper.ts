import {FeedbackType} from "../types/FeedbackType";
import {SortType} from "../types/SortType";
import {VoteState} from "../components/feedback/vote/Vote";
import {saveFeedback} from "../services/feedbackService";

export const sortMostUpVotes = (feedbackList: FeedbackType[]) => {
    return [...feedbackList].sort((a, b) =>
        (b.vote.voteUp.length - b.vote.voteDown.length) - (a.vote.voteUp.length - a.vote.voteDown.length)
    )
}

export const sortMostDownVotes = (feedbackList: FeedbackType[]) => (
    [...feedbackList].sort((a, b) =>
        (a.vote.voteUp.length - a.vote.voteDown.length) - (b.vote.voteUp.length - b.vote.voteDown.length)
    )
)

export const sortMostDiscussed = (feedbackList: FeedbackType[]) => (
    [...feedbackList].sort((a, b) => (
        b.comments.length - a.comments.length
    ))
)

export const sortLessDiscussed = (feedbackList: FeedbackType[]) => (
    [...feedbackList].sort((a, b) => (
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

export const vote = async (v: VoteState, feedback: FeedbackType, authorId: string) => {
    let voteTo: string[] = [];
    let voteFrom: string[] = [];
    const copyFeedback = {...feedback};
    if (v === VoteState.DOWN) {
        voteTo = [...feedback.vote.voteDown];
        voteFrom = [...feedback.vote.voteUp];
    }
    if (v === VoteState.UP) {
        voteTo = [...feedback.vote.voteUp];
        voteFrom =[...feedback.vote.voteDown];
    }

    if (!voteTo.includes(authorId)) {
        voteTo.push(authorId);
    } else {
        return;
    }
    if (voteFrom.includes(authorId)) {
        const index = voteFrom.indexOf(authorId);
        voteFrom.splice(index, 1);
    }

    if (v === VoteState.DOWN) {
        copyFeedback.vote = {
            voteDown: [...voteTo],
            voteUp: [...voteFrom]
        }
    }
    if (v === VoteState.UP) {
        copyFeedback.vote = {
            voteDown: [...voteFrom],
            voteUp: [...voteTo]
        }
    }
    await saveFeedback(copyFeedback);
}
