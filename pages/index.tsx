import type {GetStaticProps, NextPage} from 'next'
import {Box, Flex} from '@chakra-ui/react'
import {Logo} from "../components/feedbackList/logo/Logo";
import {Filter} from "../components/feedbackList/filter/Filter";
import {RoadmapPreview} from "../components/feedbackList/roadmapPreview/RoadmapPreview";
import {Header} from "../components/header/Header";
import {FeedbackList} from "../components/feedbackList/FeedbackList";
import {FeedbackType, RoadmapType, Type} from "../types/FeedbackType";
import {getHomePageData, getTypes} from "../services/feedbackService";
import {useEffect, useState} from "react";
import {FilterType} from "../types/FilterType";


interface HomeProps {
    feedbackList: FeedbackType[],
    types: Type[],
    roadmap: RoadmapType[]
}

const Home: NextPage<HomeProps> = ({feedbackList, types, roadmap}) => {
    const [filters, setFilters] = useState<FilterType[]>([]);

    useEffect(() => {
        if (types) {
            const newFilters: FilterType[] = [];
            newFilters.push({id: "ea837786-2009-44f9-9105-959c0e3871b8", selected: true, type: "All"});
            for (let item of types) {
                newFilters.push({id: item.id, type: item.type, selected: false});
            }
            setFilters(newFilters);
        }
    }, [types])

    return (
        <Flex direction={{
            base: 'column',
            lg: 'row'
        }}>
            <Flex
                width={{
                    base: "unset",
                    lg: "20rem"
                }}
                p={{
                    base: 0,
                    md: '1.5rem 1.5rem 0'
                }}
                direction={{
                    base: 'row',
                    lg: 'column'
                }}>
                <Logo title="Frontend Mentor" text="Feedback Board"/>
                <Filter
                    filters={filters}
                    onSelect={() => {}}
                />
                <RoadmapPreview
                    roadmap={roadmap}
                />
            </Flex>
            <Box
                p={{
                    base: 0,
                    md: '1.5rem'
                }}
                flex='1'>
                <Header title={`${feedbackList ? feedbackList.length : 0} Suggestions`} />
                <FeedbackList feedbackList={feedbackList} />
            </Box>
        </Flex>
    )
};

export const getServerSideProps: GetStaticProps<HomeProps> = async () => {
    const data = await getHomePageData();
    const types = await getTypes();
    return { props: { feedbackList: data.feedbackList, types, roadmap: data.roadmap } }
}

export default Home
