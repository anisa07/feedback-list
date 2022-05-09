import type {GetStaticProps, NextPage} from 'next'
import {Box, Flex, useMediaQuery} from '@chakra-ui/react'
import {Logo} from "../components/feedbackList/logo/Logo";
import {Filter} from "../components/feedbackList/filter/Filter";
import {RoadmapPreview} from "../components/feedbackList/roadmapPreview/RoadmapPreview";
import {Header} from "../components/header/Header";
import {FeedbackList} from "../components/feedbackList/FeedbackList";
import {FeedbackType, RoadmapType, CategoryType} from "../types/FeedbackType";
import {
    getAllFeedbacks,
    getFeedbackListByType,
    getPageData,
    getTypes
} from "../services/feedbackService";
import {useEffect, useState} from "react";
import {FilterType} from "../types/FilterType";
import {SortType} from "../types/SortType";
import {sortBy} from "../helpers/feedbackHelper";
import {breakpoints} from "../styles/screenSizes";
import {GetServerSideProps} from "next";

interface HomeProps {
    types: CategoryType[],
    roadmap: RoadmapType[],
    feedbackList: FeedbackType[]
}

const Home: NextPage<HomeProps> = ({types, roadmap, feedbackList}) => {
    const [isLargerThanMd] = useMediaQuery(`(min-width: ${breakpoints.md})`);
    const [filters, setFilters] = useState<FilterType[]>([]);
    const [sortedFeedbacks, setSortedFeedbacks] = useState<FeedbackType[]>([]);
    const [selectedType, setSelectedType] = useState<SortType>("" as SortType);

    useEffect(() => {
        if (feedbackList) {
            setSortedFeedbacks(sortBy(feedbackList, selectedType))
        }
    }, [feedbackList])

    useEffect(() => {
        if (types) {
            const newFilters: FilterType[] = [];
            newFilters.push({id: "ea837786-2009-44f9-9105-959c0e3871b8", selected: true, type: "All"});
            for (let item of types) {
                newFilters.push({id: item.id, type: item.type, selected: false});
            }
            setFilters(newFilters);
        }
    }, [types]);

    function prepareFilters(id: string) {
        const newFilters: FilterType[] = [];
        for (let item of filters) {
            newFilters.push({id: item.id, type: item.type, selected: item.id === id});
        }
        return newFilters;
    }

    const handleFilter = (id: string) => {
        const newFilters = prepareFilters(id);
        setFilters(newFilters);
        if (newFilters[0].id === id) {
            getAllFeedbacks().then(feedbacks => {
                setSortedFeedbacks(sortBy(feedbacks, selectedType));
            })
        }
        getFeedbackListByType(id).then(feedbacks => {
            setSortedFeedbacks(sortBy(feedbacks, selectedType));
        })
    }

    const handleSort = (s: SortType) => {
        setSelectedType(s);
        setSortedFeedbacks(sortBy(feedbackList, s));
    }

    return (
        <Flex direction={{ base: 'column', lg: 'row' }}>
            <Flex
                width={{ base: "unset", lg: "20rem"}}
                p={{ base: 0, md: '1.5rem 1.5rem 0' }}
                direction={{ base: 'row', lg: 'column'}}>
                <Logo title="Frontend Mentor" text="Feedback Board"/>
                <Filter
                    filters={filters}
                    onSelect={handleFilter}
                />
                <RoadmapPreview
                    roadmap={roadmap}
                />
            </Flex>
            <Box
                p={{ base: 0, md: '1.5rem' }}
                flex='1'>
                <Header
                    showTitle={isLargerThanMd}
                    showNav={false}
                    showSort={true}
                    title={`${sortedFeedbacks ? sortedFeedbacks.length : 0} Suggestions`}
                    onSort={handleSort} />
                <FeedbackList feedbackList={sortedFeedbacks} />
            </Box>
        </Flex>
    )
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
    const data = await getPageData();
    const types = await getTypes();

    return {
        props: {
            types,
            roadmap: data.roadmap,
            feedbackList: data.feedbackList
        }
    }
}

export default Home
