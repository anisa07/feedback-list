import {Box, Flex, useMediaQuery} from '@chakra-ui/react'
import {Logo} from "../components/feedbackList/logo/Logo";
import {Filter} from "../components/feedbackList/filter/Filter";
import {RoadmapPreview} from "../components/feedbackList/roadmapPreview/RoadmapPreview";
import {Header} from "../components/header/Header";
import {FeedbackList} from "../components/feedbackList/FeedbackList";
import {CategoryType, FeedbackType, RoadmapType} from "../types/FeedbackType";
import {getAllFeedbacks, getFeedbackListByType, saveFeedback,} from "../services/feedbackService";
import {useEffect, useState} from "react";
import {FilterType} from "../types/FilterType";
import {SortType} from "../types/SortType";
import {sortBy, vote} from "../helpers/feedbackHelper";
import {breakpoints} from "../styles/screenSizes";
import {useAppDispatch, useAppSelector} from "../hooks/reduxHooks";
import {getAllFeedbacksData, selectFeedbackList, selectRoadmap, selectTypes} from "../features/feedbackSlice";
import {VoteState} from "../components/feedback/vote/Vote";

const Home = () => {
    const dispatch = useAppDispatch();
    const feedbackList: FeedbackType[] = useAppSelector(selectFeedbackList);
    const roadmap: RoadmapType[] = useAppSelector(selectRoadmap);
    const types: CategoryType[] = useAppSelector(selectTypes);
    const [isLargerThanMd] = useMediaQuery(`(min-width: ${breakpoints.md})`);

    const [filters, setFilters] = useState<FilterType[]>([]);
    const [sortedFeedbacks, setSortedFeedbacks] = useState<FeedbackType[]>([]);
    const [selectedType, setSelectedType] = useState<SortType>("" as SortType);

    useEffect(() => {
        dispatch(getAllFeedbacksData());
    }, [])

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

    const handleVote = async (v: VoteState, feedback: FeedbackType) => {
        // TODO get current user
        const authorId = "9dd1a809-5bce-401e-accb-07b7f6808c11";
        await vote(v, feedback, authorId);
        dispatch(getAllFeedbacksData());
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
                <FeedbackList onVote={handleVote} feedbackList={sortedFeedbacks} />
            </Box>
        </Flex>
    )
};

export default Home
