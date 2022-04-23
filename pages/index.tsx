import type {NextPage} from 'next'
import {Logo} from "../components/feedbackList/logo/Logo";
import {Filter} from "../components/feedbackList/filter/Filter";
import {RoadmapPreview} from "../components/feedbackList/roadmapPreview/RoadmapPreview";
import {RoadmapEnum} from "../types/RoadmapType";
import {Header} from "../components/header/Header";
import {FeedbackList} from "../components/feedbackList/FeedbackList";

const Home: NextPage = () => {
    return (
        <div className="flex-col flex lg:flex-row">
            <div className="p-0 md:flex md:flex-row md:pb-0 md:p-5 lg:flex-col lg:basis-1/4">
                <Logo title="Frontend Mentor" text="Feedback Board"/>
                <Filter
                    filters={[
                        {id: "123", selected: true, filter: "All"},
                        {id: "124", selected: false, filter: "Bug"},
                    ]}
                    onSelect={() => {}}
                />
                <RoadmapPreview
                    roadmaps={[
                        {status: RoadmapEnum.LIVE, quantity: 5},
                        {status: RoadmapEnum.IN_PROGRESS, quantity: 7},
                        {status: RoadmapEnum.PLANNED, quantity: 1},
                    ]}
                />
            </div>
            <div className="p-0 md:p-5 pt-0 lg:basis-3/4">
                <Header title="6 Suggestions" />
                <FeedbackList feedbackList={[
                    {
                        id: "123",
                        title: "Title",
                        detail: "Test test test test test test",
                        vote: {
                            voteUp: [],
                            voteDown: [],
                        },
                        author: {
                            name: "Author",
                            email: "test@test.com",
                            id: "123",
                            img: ""
                        },
                        comments: [],
                        category: {
                            id: "123",
                            category: "bug"
                        },
                        status: {
                            id: "123",
                            status: RoadmapEnum.PLANNED
                        }
                    }
                ]} />
            </div>
        </div>
    )
};

export default Home
