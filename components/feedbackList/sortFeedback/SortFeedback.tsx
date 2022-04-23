import {SyntheticEvent} from "react";

interface SortFeedbackProps {
    sortItems: string[],
    onSort: (sortItem: string) => void
}

export const SortFeedback = (props: SortFeedbackProps) => {
    const handleSelect = (e: SyntheticEvent) => {
        console.log(e)
        // props.onSort(e.target.value);
    }

    return (
        <div>
            <span>Sort by : </span>
            <select className="appearance-none bg-transparent font-semibold" onSelect={handleSelect}>
                {props.sortItems.map(item => (
                    <option key={item}>
                        {item}
                    </option>
                ))}
            </select>
        </div>
    )
}
