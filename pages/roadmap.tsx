import {Header} from "../components/header/Header";
import {Box, Flex, Tabs, TabList, TabPanels, Tab, TabPanel, Text} from "@chakra-ui/react";
import {FeedbackType, RoadmapType, StatusEnum, UserType} from "../types/FeedbackType";
import {useEffect, useState} from "react";
import {RoadmapCard} from "../components/roadmapView/roadmapCard/RoadmapCard";
import {useAppDispatch, useAppSelector} from "../hooks/reduxHooks";
import {
    getAllFeedbacksData,
    selectFeedbackList,
    selectFeedbackLoading,
    selectRoadmap
} from "../features/feedbackSlice";
import {VoteState} from "../components/feedback/vote/Vote";
import {vote} from "../helpers/feedbackHelper";
import {getFromSessionStorage} from "../services/storageService";
import {useRouter} from "next/router";
import {FEEDBACK_USER_KEY} from "../services/authService";
import {Loading, LoadingSpinner} from "../components/loading/Loading";
import {saveFeedback} from "../services/feedbackService";
import {useErrorHandlerHook} from "../hooks/errorHandlerHook";

export interface FeedbackMapType {
    name: StatusEnum,
    quantity: number,
    feedbackList: FeedbackType[]
}

const Roadmap = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {handleErrorByCode} = useErrorHandlerHook();
    const loading: boolean = useAppSelector(selectFeedbackLoading);
    const feedbackList: FeedbackType[] = useAppSelector(selectFeedbackList);
    const roadmap: RoadmapType[] = useAppSelector(selectRoadmap);
    const [loadingFeedback, setLoadingFeedback] = useState(false);

    useEffect(() => {
        dispatch(getAllFeedbacksData());
    }, [])

    const [feedbackMap, setFeedbackMap] = useState<Record<StatusEnum, FeedbackMapType>>({
        [StatusEnum.PLANNED]: {
            name: StatusEnum.PLANNED,
            quantity: 0,
            feedbackList: []
        },
        [StatusEnum.IN_PROGRESS]: {
            name: StatusEnum.IN_PROGRESS,
            quantity: 0,
            feedbackList: []
        },
        [StatusEnum.LIVE]: {
            name: StatusEnum.LIVE,
            quantity: 0,
            feedbackList: []
        }
    });

    useEffect(() => {
        const newFeedbackMap = {...feedbackMap};
        if (roadmap && feedbackList) {
            for (let status of roadmap) {
                for (let feedback of feedbackList) {
                    if (status.id === feedback.status.id) {
                        newFeedbackMap[status.status].feedbackList.push(feedback);
                        newFeedbackMap[status.status].quantity = status.quantity;
                    }
                }
            }
            setFeedbackMap(newFeedbackMap);
        }
    }, [feedbackList, roadmap])

    const handleVote = async (v: VoteState, roadmapCard: FeedbackType) => {
        const author: UserType = getFromSessionStorage(FEEDBACK_USER_KEY as string);
        if (author) {
            const copyOfFeedback = await vote(v, roadmapCard, author.id);
            setLoadingFeedback(false);
            if (copyOfFeedback) {
                await saveFeedback(copyOfFeedback, handleErrorByCode, () => {
                    dispatch(getAllFeedbacksData())
                });
                setLoadingFeedback(false);
            }
        } else {
            await router.push("/login");
            setLoadingFeedback(false);
        }
    }

    if (loading) {
        return <Loading/>
    }

    return <Box p={{base: 0, md: '1.5rem'}}>
        <Header
            showTitle={true}
            showNav={true}
            showSort={false}
            title="Roadmap"/>
        <Tabs display={{
            base: "block",
            md: "none"
        }}>
            <TabList>
                {Object.values(feedbackMap).map(feedbackItem => (
                    <Tab mr="0.5rem" fontWeight="bold" key={feedbackItem.name} flex="1">
                        {`${feedbackItem.name}(${feedbackItem.quantity})`}
                    </Tab>
                ))}
            </TabList>

            <TabPanels>
                {Object.values(feedbackMap).map(feedbackItem => (
                    <TabPanel key={feedbackItem.name} flex="1">
                        {feedbackItem.feedbackList.map(feedback => (
                            <RoadmapCard onVote={handleVote} key={feedback.id} roadmapCard={feedback}
                                         name={feedbackItem.name}/>
                        ))}
                    </TabPanel>
                ))}
            </TabPanels>
        </Tabs>

        <Flex display={{
            base: "none",
            md: "flex"
        }}>
            {Object.values(feedbackMap).map(feedbackItem => (
                <Text mr="0.5rem" fontWeight="bold" key={feedbackItem.name} flex="1">
                    {`${feedbackItem.name}(${feedbackItem.quantity})`}
                </Text>
            ))}
        </Flex>

        <Flex
            display={{
                base: "none",
                md: "flex"
            }}>
            {loadingFeedback
                ? <LoadingSpinner/>
                : Object.values(feedbackMap).map(feedbackItem => (
                    <Flex key={feedbackItem.name} flexDirection="column" flex="1" mt="0.5rem" mr="0.5rem">
                        {feedbackItem.feedbackList.map(feedback => (
                            <RoadmapCard onVote={handleVote} key={feedback.id} roadmapCard={feedback}
                                         name={feedbackItem.name}/>
                        ))}
                    </Flex>
                ))}
        </Flex>
    </Box>
}

export default Roadmap
