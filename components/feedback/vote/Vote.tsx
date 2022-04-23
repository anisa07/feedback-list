import {VoteType} from "../../../types/FeedbackType";

interface VoteProps {
    voteData: VoteType,
}

export const Vote = (props: VoteProps) => {
    const voteValue = () => {
        return props.voteData.voteUp.length - props.voteData.voteDown.length;
    }
    return (
        <div className="bg-lightbluegray text-blue inline-block rounded py-1 px-3">
            <div className="flex flex-col items-center">
                <button>&#9653;</button>
                {voteValue()}
                <button>&#9661;</button>
            </div>
        </div>
    )
}
