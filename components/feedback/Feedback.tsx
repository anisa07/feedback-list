import {FeedbackType} from "../../types/FeedbackType";
import {Vote} from "./vote/Vote";

interface FeedbackProps {
    feedback: FeedbackType
}

export const Feedback = (props: FeedbackProps) => {
    return <div className="bg-white rounded mb-3 p-5 flex">
        <div className="basis-1/5 flex items-center justify-center">
            <Vote voteData={props.feedback.vote}/>
        </div>
        <div className="basis-4/5">
            <h4 className="font-semibold">
                {props.feedback.title}
            </h4>
            <p className="text-darkgray my-2">
                {props.feedback.detail}
            </p>
            <span className="bg-lightbluegray text-blue rounded-xl px-3 py-1 font-semibold inline-block">
                {props.feedback.category.category}
            </span>
        </div>
        <div className="basis-1/5 font-semibold text-darkgray self-center justify-center">
            {props.feedback.comments.length}
        </div>
    </div>
}
