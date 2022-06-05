import {Box, Flex, useMediaQuery} from '@chakra-ui/react'
import {Logo} from "../components/feedbackList/logo/Logo";
import {Filter} from "../components/feedbackList/filter/Filter";
import {RoadmapPreview} from "../components/feedbackList/roadmapPreview/RoadmapPreview";
import {Header} from "../components/header/Header";
import {FeedbackList} from "../components/feedbackList/FeedbackList";
import {CategoryType, FeedbackType, RoadmapType} from "../types/FeedbackType";
import {getFeedbacksByTypeId, saveFeedback} from "../services/feedbackService";
import {useEffect, useState} from "react";
import {FilterType} from "../types/FilterType";
import {SortType} from "../types/SortType";
import {sortBy, vote} from "../helpers/feedbackHelper";
import {breakpoints} from "../styles/screenSizes";
import {useAppDispatch, useAppSelector} from "../hooks/reduxHooks";
import {
    getAllFeedbacksData,
    selectFeedbackList,
    selectFeedbackLoading,
    selectRoadmap,
    selectTypes
} from "../features/feedbackSlice";
import {VoteState} from "../components/feedback/vote/Vote";
import {getFromSessionStorage} from "../services/storageService";
import {useRouter} from "next/router";
import {FEEDBACK_USER_KEY} from "../services/authService";
import {Loading, LoadingSpinner} from "../components/loading/Loading";
import {useErrorHandlerHook} from "../hooks/errorHandlerHook";

const Home = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { handleErrorByCode } = useErrorHandlerHook();
    const feedbackList: FeedbackType[] = useAppSelector(selectFeedbackList);
    const roadmap: RoadmapType[] = useAppSelector(selectRoadmap);
    const types: CategoryType[] = useAppSelector(selectTypes);
    const loading: boolean = useAppSelector(selectFeedbackLoading);
    const [isLargerThanMd] = useMediaQuery(`(min-width: ${breakpoints.md})`);

    const [filters, setFilters] = useState<FilterType[]>([]);
    const [sortedFeedbacks, setSortedFeedbacks] = useState<FeedbackType[]>([]);
    const [loadingFeedback, setLoadingFeedback] = useState(false);
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
        setLoadingFeedback(true);
        const newFilters = prepareFilters(id);
        setFilters(newFilters);
        if (newFilters[0].id === id) {
            setSortedFeedbacks(sortBy(feedbackList, selectedType));
            setLoadingFeedback(false);
        } else {
            getFeedbacksByTypeId(id).then(feedbacks => {
                setSortedFeedbacks(sortBy(feedbacks, selectedType));
            }).finally(() => {
                setLoadingFeedback(false);
            })
        }
    }

    const handleSort = (s: SortType) => {
        setSelectedType(s);
        setSortedFeedbacks(sortBy(feedbackList, s));
    }

    const handleVote = async (v: VoteState, feedback: FeedbackType) => {
        const author: {id: string, token: string} = getFromSessionStorage(FEEDBACK_USER_KEY as string);
        setLoadingFeedback(true);
        if (author) {
            const copyOfFeedback = vote(v, feedback, author.id);
            setLoadingFeedback(false);
            if (copyOfFeedback) {
                await saveFeedback(copyOfFeedback, handleErrorByCode,() => {dispatch(getAllFeedbacksData())});
                setLoadingFeedback(false);
            }
        } else {
            await router.push("/login", );
            setLoadingFeedback(false);
        }
    }

    if (loading) {
        return <Loading />
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
                { loadingFeedback
                    ? <LoadingSpinner />
                    : <FeedbackList onVote={handleVote} feedbackList={sortedFeedbacks}/> }
            </Box>
        </Flex>
    )
};

export default Home
