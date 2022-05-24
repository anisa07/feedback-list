const express = require("express");
const {dynamoDbClient} = require("../dbClient");
const AWS = require("aws-sdk");

const v4 = AWS.util.uuid.v4;
const feedbackRouter = express.Router();
const FEEDBACKS_TABLE = process.env.FEEDBACKS_TABLE;
const COMMENTS_TABLE = process.env.COMMENTS_TABLE;
const TYPES_TABLE = process.env.TYPES_TABLE;
const STATUSES_TABLE = process.env.STATUSES_TABLE;
const USERS_TABLE = process.env.USERS_TABLE;

async function fillDataOfFeedback(feedback, res) {
    const commentsParams = {
        TableName: COMMENTS_TABLE,
    };
    const authorSearchParams = {
        TableName: USERS_TABLE,
        Key: {
            id: feedback.authorId,
        },
    };
    const typeSearchParams = {
        TableName: TYPES_TABLE,
        Key: {
            id: feedback.typeId,
        }
    }
    const statusSearchParams = {
        TableName: STATUSES_TABLE,
        Key: {
            id: feedback.statusId
        }
    }

    try {
        const {Items: comments} = await dynamoDbClient.scan(commentsParams).promise();
        const {Item: author} = await dynamoDbClient.get(authorSearchParams).promise();
        const {Item: type} = await dynamoDbClient.get(typeSearchParams).promise();
        const {Item: status} = await dynamoDbClient.get(statusSearchParams).promise();
        const commentsPerFeedback = comments.filter((comment) => comment.feedbackId === feedback.id);
        const commentsUpdated = []
        for (let comment of commentsPerFeedback) {
            const commentAuthorSearchParams = {
                TableName: USERS_TABLE,
                Key: {
                    id: comment.authorId,
                },
            };
            const {Item: commentAuthor} = await dynamoDbClient.get(commentAuthorSearchParams).promise();
            commentsUpdated.push({
                id: comment.id,
                comment: comment.text,
                author: commentAuthor
            })
        }

        return {
            id: feedback.id,
            title: feedback.title,
            detail: feedback.detail,
            vote: feedback.vote,
            author,
            comments: commentsUpdated,
            type,
            status
        };
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Could not get feedback " + feedback.id});
    }
}

async function getRoadmapData(feedbacks, res) {
    const statusesSearchParams = {
        TableName: STATUSES_TABLE
    };
    const roadmap = {};

    try {
        const {Items: statuses} = await dynamoDbClient.scan(statusesSearchParams).promise();
        for (const item of statuses) {
            roadmap[item.status] = {...item, quantity: 0};
        }
        for (const item of feedbacks) {
            const statusSearchParams = {
                TableName: STATUSES_TABLE,
                Key: {
                    id: item.statusId
                }
            }
            const {Item: status} = await dynamoDbClient.get(statusSearchParams).promise();
            roadmap[status.status].quantity += 1;
        }
        return roadmap
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Could not get roadmap values"});
    }
}

feedbackRouter.post("/comment", async function (req, res) {
    const { authorId, text, feedbackId } = req.body;
    const commentParams = {
        TableName: COMMENTS_TABLE,
        Item: {
            id: v4(),
            authorId,
            text,
            feedbackId
        },
    };

    try {
        console.log(commentParams);
        await dynamoDbClient.put(commentParams).promise();
        res.json({id: commentParams.Item.id});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Could not create comment"});
    }
})

feedbackRouter.post("/type", async function (req, res) {
    const { type } = req.body;
    const typeParams = {
        TableName: TYPES_TABLE,
        Item: {
            id: v4(),
            type
        },
    };

    try {
        console.log(typeParams);
        await dynamoDbClient.put(typeParams).promise();
        res.json({id: typeParams.Item.id});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Could not create type"});
    }
})

feedbackRouter.post("/status", async function (req, res) {
    const { status, description } = req.body;
    const statusParams = {
        TableName: STATUSES_TABLE,
        Item: {
            id: v4(),
            status,
            description
        },
    };

    try {
        console.log(statusParams);
        await dynamoDbClient.put(statusParams).promise();
        res.json({id: statusParams.Item.id});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Could not create status"});
    }
})

feedbackRouter.get("/:id", async function (req, res) {
    const params = {
        TableName: FEEDBACKS_TABLE,
        Key: {
            id: req.params.id,
        },
    };

    try {
        const { Item } = await dynamoDbClient.get(params).promise();
        if (Item) {
            const feedback = await fillDataOfFeedback(Item, res);
            res.json({ feedback });
        } else {
            res
                .status(404)
                .json({ error: 'Could not find user with provided "feedbackId"' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Could not retreive feedbackId" });
    }
});

feedbackRouter.get("/", async function (req, res) {
    const typeId = req.query.typeId;
    const params = !typeId ? {
        TableName: FEEDBACKS_TABLE,
    } : {
        TableName: FEEDBACKS_TABLE,
        FilterExpression: "#typeId = :typeId",
        ExpressionAttributeNames: {
            "#typeId": "typeId",
        },
        ExpressionAttributeValues: {":typeId": typeId}
    }
    const feedbackList = [];

    try {
        const {Items: feedbacks} = await dynamoDbClient.scan(params).promise();
        for (const item of feedbacks) {
            const feedback = await fillDataOfFeedback(item, res);
            feedbackList.push(feedback);
        }
        const roadmap = await getRoadmapData(feedbacks, res);
        res.json({
            feedbacks: feedbackList,
            roadmap
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Could not form feedbacks data"});
    }
});

feedbackRouter.post("/", async function (req, res) {
    const { title, detail, vote, type, id: feedbackId, author, status } = req.body;
    const id = feedbackId || v4();
    const feedbackParams = {
        TableName: FEEDBACKS_TABLE,
        Item: {
            id,
            title,
            detail,
            vote,
            typeId: type.id,
            authorId: author.id,
            statusId: status.id
        },
    };
    const statusesSearchParams = {
        TableName: STATUSES_TABLE,
    };

    try {
        if (!status.id) {
            const {Items: statuses} = await dynamoDbClient.scan(statusesSearchParams).promise();
            if (statuses.length){
                feedbackParams.Item.statusId = (statuses.find((item) => item.status === "Planned"))?.id || "";
            }
        }
        await dynamoDbClient.put(feedbackParams).promise();
        res.json({id});
        console.log(feedbackParams)
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Could not create feedback"});
    }
});

module.exports.feedbackRouter = feedbackRouter;
