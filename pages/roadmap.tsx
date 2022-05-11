import {Header} from "../components/header/Header";
import {Box, Flex, Tabs, TabList, TabPanels, Tab, TabPanel, Text} from "@chakra-ui/react";
import {FeedbackType, RoadmapType, StatusEnum} from "../types/FeedbackType";
import {useEffect, useState} from "react";
import {RoadmapCard} from "../components/roadmapView/roadmapCard/RoadmapCard";
import {useAppDispatch, useAppSelector} from "../hooks/reduxHooks";
import {getAllFeedbacksData, selectFeedbackList, selectRoadmap} from "../features/feedbackSlice";
import {VoteState} from "../components/feedback/vote/Vote";
import {vote} from "../helpers/feedbackHelper";

export interface FeedbackMapType {
    name: StatusEnum,
    quantity: number,
    feedbackList: FeedbackType[]
}

const Roadmap = () => {
    const dispatch = useAppDispatch();
    const feedbackList: FeedbackType[] = useAppSelector(selectFeedbackList);
    const roadmap: RoadmapType[] = useAppSelector(selectRoadmap);

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
    }, [feedbackList,roadmap])

    const handleVote = async (v: VoteState, roadmapCard: FeedbackType) => {
        // TODO get current user
        const authorId = "9dd1a809-5bce-401e-accb-07b7f6808c11";
        await vote(v, roadmapCard, authorId);
        dispatch(getAllFeedbacksData());
    }

    return <Box p={{ base: 0, md: '1.5rem' }}>
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
                            <RoadmapCard onVote={handleVote} key={feedback.id} roadmapCard={feedback} name={feedbackItem.name} />
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
            {Object.values(feedbackMap).map(feedbackItem => (
                <Flex key={feedbackItem.name} flexDirection="column" flex="1" mt="0.5rem" mr="0.5rem">
                    {feedbackItem.feedbackList.map(feedback => (
                        <RoadmapCard onVote={handleVote} key={feedback.id} roadmapCard={feedback} name={feedbackItem.name} />
                    ))}
                </Flex>
            ))}
        </Flex>
    </Box>
}

export default Roadmap
