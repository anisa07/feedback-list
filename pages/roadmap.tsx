import {Header} from "../components/header/Header";
import {Box, Flex, Tabs, TabList, TabPanels, Tab, TabPanel, Text} from "@chakra-ui/react";
import {GetServerSideProps, GetStaticProps, NextPage} from "next";
import {getFeedbackData} from "../services/feedbackService";
import {FeedbackType, RoadmapType, StatusEnum} from "../types/FeedbackType";
import {useEffect, useState} from "react";
import {RoadmapCard} from "../components/roadmapView/roadmapCard/RoadmapCard";

interface RoadmapProps {
    roadmap: RoadmapType[],
    feedbackList: FeedbackType[]
}

export interface FeedbackMapType {
    name: StatusEnum,
    quantity: number,
    feedbackList: FeedbackType[]
}

const Roadmap: NextPage<RoadmapProps> = ({roadmap, feedbackList}) => {
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
                            <RoadmapCard key={feedback.id} roadmapCard={feedback} name={feedbackItem.name} />
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
                        <RoadmapCard key={feedback.id} roadmapCard={feedback} name={feedbackItem.name} />
                    ))}
                </Flex>
            ))}
        </Flex>
    </Box>
}

export const getServerSideProps: GetServerSideProps<RoadmapProps> = async () => {
    const data = await getFeedbackData();

    return {
        props: {
            roadmap: data.roadmap,
            feedbackList: data.feedbackList
        }
    }
}

export default Roadmap
