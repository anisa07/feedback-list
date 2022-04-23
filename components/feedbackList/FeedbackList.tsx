import {FeedbackType} from "../../types/FeedbackType";
import {Feedback} from "../feedback/Feedback";

interface FeedbackListProps {
    feedbackList: FeedbackType[];
}

export const FeedbackList = (props: FeedbackListProps) => {
    return <div className="p-3 pt-0 md:p-0">
        {props.feedbackList.map(item =>
            <Feedback key={item.id} feedback={item} />
        )}
    </div>
}
