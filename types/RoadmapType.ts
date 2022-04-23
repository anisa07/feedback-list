
export enum RoadmapEnum {
    PLANNED = "PLANNED",
    IN_PROGRESS = "IN-PROGRESS",
    LIVE = "LIVE"
}

export interface RoadmapType {
    status: RoadmapEnum,
    quantity: number
}
