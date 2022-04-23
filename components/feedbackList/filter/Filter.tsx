import {FilterType} from "../../../types/FilterType";

interface FilterProps {
    filters: FilterType[],
    onSelect: (f: FilterType) => void
}

export const Filter = (props: FilterProps) => {
    const colorClass = (item: FilterType) => {
        return item.selected ? `bg-blue text-white` : `bg-lightbluegray text-blue`
    }
    return (
        <div className="hidden md:flex lg:flex p-5 lg:mr-0 md:mb-3 md:mr-3 bg-white rounded flex-wrap items-start">
            {props.filters.map(item => (
                <div key={item.id} className={`px-3 py-1 m-1 rounded-xl font-semibold ${colorClass(item)}`}>{item.filter}</div>
            ))}
        </div>
    )
}
