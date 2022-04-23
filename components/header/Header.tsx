import {SortFeedback} from "../feedbackList/sortFeedback/SortFeedback";

interface HeaderProps {
    title: string;
}

export const Header = (props: HeaderProps) => {
    return (
        <header className="md:rounded p-5 bg-darkgrayblue text-white flex justify-between items-center mb-3">
            <div className="flex justify-between items-center">
                <h3 className="font-bold mr-5">
                    {props.title}
                </h3>
                <SortFeedback sortItems={["Most Upvotes", "Most Discussed", "Less Upvotes", "Less Discussed"]} onSort={(i:string)=>{}}/>
            </div>
            <button className="text-white bg-fuchsia rounded py-2 px-3 font-semibold">
                + Add Feedback
            </button>
        </header>
    )
}
