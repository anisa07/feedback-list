import {RoadmapEnum, RoadmapType} from "../../../types/RoadmapType";

export interface RoadmapPreviewProps {
    roadmaps: RoadmapType[]
}

export const RoadmapPreview = (props: RoadmapPreviewProps) => {
    const selectColorClass = (item: RoadmapType) => {
        switch (item.status) {
            case RoadmapEnum.PLANNED:
                return "text-salmon";
            case RoadmapEnum.IN_PROGRESS:
                return "text-fuchsia";
            case RoadmapEnum.LIVE:
                return "text-lightblue";
        }
    }

    return (<div className="hidden md:inline-block lg:inline-block rounded p-5 md:mb-3 bg-white md:w-72 lg:w-auto">
        <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Roadmap</span>
            <a className="text-xs underline text-blue">View</a>
        </div>
        {props.roadmaps.map(item => (
            <div key={item.status} className="flex justify-between items-center text-darkgray">
                <span>
                    <span className={`text-2xl ${selectColorClass(item)}`}>&#8226; </span>
                    <span className="text-xs capitalize">{item.status}</span>
                </span>
                <span className="font-semibold">
                    {item.quantity}
                </span>
            </div>
        ))}
    </div>);
}
